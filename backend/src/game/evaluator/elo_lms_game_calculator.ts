import { Problems } from "../../models/problem";
import { Tiers } from "../../models/tiers";
import { Users, User, UserLevel } from "../../models/users";
import { UserResult, UserScoreAndPenalty } from "../../services/uvu_game_service";
import { RankTier } from "../../utils/definitions/rank_tier";
import { LMSGameState } from "../store/lms/i_game_lms_store";
import { ILMSGameCalculator } from "./i_lms_game_calculator";
import dotenv from 'dotenv'
dotenv.config()

const { GROWTH_RATE, LEVEL_K, INITIAL_XP } = process.env
const K = 32

export class LMSGameCalculator implements ILMSGameCalculator {
  async calculate(
    users_score_and_penalty: Map<string, UserScoreAndPenalty>,
    lms_game_state: LMSGameState,
  ) {
    const users = await Users.get_by_usernames(lms_game_state.usernames)
    const expected_scores = await this.calculate_expected_scores(users)
    // console.log("expected score", expected_scores)
    const actual_scores = await this.calculate_actual_scores(users_score_and_penalty)
    // console.log("actual scores", actual_scores)
    this.calculate_new_mmr_of_users(expected_scores, actual_scores, users, lms_game_state)
    await this.calculate_new_rank_tier_and_points_of_users(lms_game_state)
    this.calculate_delta_of_users(users, lms_game_state)
    this.calculate_level_and_xp_of_users(users_score_and_penalty, users, lms_game_state, await Problems.get_problem_rate(lms_game_state.problem_id!))
    // console.log(lms_game_state)
  }

  calculate_level_and_xp_of_users(users_score_and_penalty: Map<string, UserScoreAndPenalty>, users: User[], lms_game_state: LMSGameState, problem_rate: string) {
    for (const user_result of lms_game_state.current_users_results!) {
      this.calculate_new_level_and_xp(
        users_score_and_penalty.get(user_result[0])!,
        user_result[1],
        user_result[1].new_level!,
        lms_game_state.duration!
      )
    }
  }

  private calculate_new_level_and_xp(
    user_score_and_penalty: UserScoreAndPenalty,
    user_result: UserResult,
    user_level: UserLevel,
    game_duration: number) {
    const gained_xp = (user_score_and_penalty.score / 100) * this.get_base_xp(user_level.level) * (1 - this.penalty_factor(user_score_and_penalty, game_duration))
    user_result.new_level = user_level
    user_result.xp_delta! += gained_xp
    user_result.new_level.xp += gained_xp
    user_result.new_level.level = this.get_level(user_result.new_level.xp)
    user_result.new_level.xp_for_next_level = this.get_xp_for_next_level(user_result.new_level.level)
    user_result.new_level.rating = user_level.rating
  }

  calculate_delta_of_users(users: User[], lms_game_state: LMSGameState) {
    for (const user of users) {
      const new_delta = this.calculate_delta(
        { tier: user.rank_tier!, points: user.rank_points! },
        {
          tier: lms_game_state.current_users_results!.get(user.username!)?.new_tier!,
          points: lms_game_state.current_users_results!.get(user.username!)?.new_points!
        }
      )
      lms_game_state.current_users_results!.get(user.username!)!.delta! = (new_delta!)
    }
  }

  private calculate_delta(old_tier_and_pts: { tier: RankTier, points: number }, new_tier_and_pts: { tier: RankTier, points: number }) {
    if (old_tier_and_pts.tier == new_tier_and_pts.tier) {
      return new_tier_and_pts.points - old_tier_and_pts.points
    }
    else if (old_tier_and_pts.tier < new_tier_and_pts.tier) {
      return (100 - old_tier_and_pts.points) + (new_tier_and_pts.points)
    }
    else {
      return (old_tier_and_pts.points + (100 - new_tier_and_pts.points)) * -1
    }
  }

  async calculate_new_rank_tier_and_points_of_users(lms_game_state: LMSGameState) {
    for (const user_result of lms_game_state.current_users_results!) {
      const new_rank_tier_and_points = await this.calculate_tier_and_points(user_result[1].new_mmr!)
      user_result[1].new_tier = new_rank_tier_and_points.tier
      user_result[1].new_points = new_rank_tier_and_points.points
    }
  }

  private async calculate_tier_and_points(mmr: number): Promise<{ tier: RankTier, points: number }> {
    const tiers = await Tiers.index()
    let rank_tier: RankTier = RankTier.Bronze
    let points = 0
    for (const tier of tiers) {
      if (tier.max_mmr == -1) {
        rank_tier = tier.rank_tier
        points = mmr - tier.min_mmr
      }
      else if (mmr >= tier.min_mmr && mmr <= tier.max_mmr) {
        rank_tier = tier.rank_tier
        const range = tier.max_mmr - tier.min_mmr
        points = Math.round(((mmr - tier.min_mmr) / (range)) * 100)
        break
      }
    }

    return { tier: rank_tier, points: points }
  }

  calculate_eliminated_users(users_scores_and_penalty: Map<string, UserScoreAndPenalty>): string[] {
    const users_rank_in_round = this.calculate_users_rank_in_round(users_scores_and_penalty)
    const haif_index = Math.floor(users_rank_in_round.length / 2);
    const second_haif_users = users_rank_in_round.slice(haif_index)
    return second_haif_users.map(user_rank => user_rank.username)
  }

  calculate_new_mmr_of_users(expected_scores: Map<string, number>, actual_scores: Map<string, number>, users: User[], lms_game_state: LMSGameState) {
    for (const user of users) {
      if (lms_game_state.current_users_results!.has(user.username!)) {
        // console.log(`new_mmr a ${lms_game_state.current_users_results!.get(user.username!)!.new_mmr!}`)
        lms_game_state.current_users_results!.get(user.username!)!.new_mmr! += K * (actual_scores.get(user.username!)! - expected_scores.get(user.username!)!)
        // console.log(`new_mmr b ${lms_game_state.current_users_results!.get(user.username!)!.new_mmr!}`)
        lms_game_state.current_users_results!.get(user.username!)!.new_mmr! = Math.max(800, lms_game_state.current_users_results!.get(user.username!)!.new_mmr!)
        // console.log(`new_mmr c ${lms_game_state.current_users_results!.get(user.username!)!.new_mmr!}`)

      }
    }
  }

  private get_xp_for_next_level(level: number) {
    return Math.pow(level + 1 / parseFloat(LEVEL_K!), 2)
  }
  private get_level(xp: number) {
    return Math.floor(parseFloat(LEVEL_K!) * Math.sqrt(xp))
  }

  private penalty_factor(user_score_and_penalty: UserScoreAndPenalty, game_duration: number) {
    return (user_score_and_penalty.penalty / (10 * user_score_and_penalty.number_of_incorrect_submissions! + game_duration))
  }

  private get_base_xp(level: number) {
    return parseFloat(INITIAL_XP!) * Math.pow(parseFloat(GROWTH_RATE!), level)
  }

  calculate_users_rank_in_round(users_score_and_penalty: Map<string, UserScoreAndPenalty>): { username: string, rank: number }[] {
    const users_rank_in_round: { username: string, rank: number }[] = []
    const users_score_and_penalty_array = this.sort_users_score_and_penalty_map(users_score_and_penalty)
    let current_rank = 0
    for (let i = 0; i < users_score_and_penalty_array.length; i++) {
      if (!(i && users_score_and_penalty_array[i - 1].score == users_score_and_penalty_array[i].score &&
        users_score_and_penalty_array[i - 1].penalty == users_score_and_penalty_array[i].penalty)) {
        current_rank += 1
      }
      users_rank_in_round.push({
        username: users_score_and_penalty_array[i].username,
        rank: current_rank
      })

    }
    // console.log("ranks :", users_rank_in_round)
    return users_rank_in_round
  }

  private sort_users_score_and_penalty_map(users_score_and_penalty: Map<string, UserScoreAndPenalty>) {
    // Convert map values to an array
    // console.log("sort_users_score_and_penalty_map", users_score_and_penalty)
    const users_score_and_penalty_array = Array.from(users_score_and_penalty.values());
    users_score_and_penalty_array.sort((lhs, rhs) => {
      if (lhs.score > rhs.score) {
        return -1;
      }
      if (lhs.score < rhs.score) {
        return 1;
      }
      if (lhs.penalty < rhs.penalty) {
        return -1;
      }
      if (lhs.penalty > rhs.penalty) {
        return 1;
      }
      return 0;
    });
    // console.log("sort_users_score_and_penalty_map", users_score_and_penalty_array)
    return users_score_and_penalty_array;
  }
  calculate_actual_scores(users_score_and_penalty: Map<string, UserScoreAndPenalty>): Map<string, number> {
    const actual_scores = new Map<string, number>()
    const users_rank_in_round = this.calculate_users_rank_in_round(users_score_and_penalty)
    const length_of_users = users_rank_in_round.length
    for (const user_rank_in_round of users_rank_in_round) {
      actual_scores.set(
        user_rank_in_round.username,
        (length_of_users - user_rank_in_round.rank) / (length_of_users - 1)
      )
    }
    return actual_scores
  }

  async calculate_expected_scores(users: User[]): Promise<Map<string, number>> {
    const expected_scores = new Map<string, number>()
    for (const user of users) {
      expected_scores.set(user.username!, 0)
    }
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (i == j)
          continue
        const expected_score = 1 / (1 + Math.pow(10, (users[j].mmr! - users[i].mmr!) / 480));
        expected_scores.set(
          users[i].username!,
          (expected_scores.get(users[i].username!) ?? 0) + expected_score / (users.length - 1));

      }
    }
    return expected_scores
  }
}