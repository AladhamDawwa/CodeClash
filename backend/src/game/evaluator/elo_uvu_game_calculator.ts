import { Tiers } from "../../models/tiers";
import { User, UserLevel } from "../../models/users";
import { UserScoreAndPenalty, UvUGameResult, UvUUserGameStatus, UserResult } from "../../services/uvu_game_service";
import { GameMode } from "../../utils/definitions/games_types";
import { RankTier } from "../../utils/definitions/rank_tier";
import { IUvUGameCalculator } from "./I_uvu_game_calculator";
import dotenv from 'dotenv'
dotenv.config()

const { GROWTH_RATE, LEVEL_K, INITIAL_XP, XP_PROBLEM_RATE_FACTOR } = process.env
const K = 32
export class EloUvUGameCalculator implements IUvUGameCalculator {
  async calculate(
    user_a_score_and_penalty: UserScoreAndPenalty,
    user_b_score_and_penalty: UserScoreAndPenalty,
    user_a_uvu_game_result: UserResult,
    user_b_uvu_game_result: UserResult,
    game_mode: GameMode,
    game_duration: number,
    problem_rate: string,
    user_a: User,
    user_b: User): Promise<UvUGameResult> {

    this.determine_winner(
      user_a_score_and_penalty,
      user_b_score_and_penalty,
      user_a_uvu_game_result,
      user_b_uvu_game_result
    )
    if (game_mode == GameMode.Ranked) {
      const expected_outcome_user_a = this.calculate_expected_outcome(user_a.mmr!, user_b.mmr!)
      const expected_outcome_user_b = 1 - expected_outcome_user_a
      const new_user_a_mmr = this.calculate_new_mmr(
        user_a.mmr!, this.get_score(user_a_uvu_game_result.status!), expected_outcome_user_a
      )
      const new_user_b_mmr = this.calculate_new_mmr(
        user_b.mmr!, this.get_score(user_b_uvu_game_result.status!), expected_outcome_user_b
      )
      user_a_uvu_game_result.new_mmr = new_user_a_mmr
      user_b_uvu_game_result.new_mmr = new_user_b_mmr

      const user_a_new_tier_and_points = await this.calculate_tier_and_points(new_user_a_mmr)
      const user_b_new_tier_and_points = await this.calculate_tier_and_points(new_user_b_mmr)
      user_a_uvu_game_result.new_tier = user_a_new_tier_and_points.tier
      user_b_uvu_game_result.new_tier = user_b_new_tier_and_points.tier
      user_a_uvu_game_result.new_points = user_a_new_tier_and_points.points
      user_b_uvu_game_result.new_points = user_b_new_tier_and_points.points

      const user_a_delta = this.calculate_delta({ tier: user_a.rank_tier!, points: user_a.rank_points! }, user_a_new_tier_and_points)
      const user_b_delta = this.calculate_delta({ tier: user_b.rank_tier!, points: user_b.rank_points! }, user_b_new_tier_and_points)
      user_a_uvu_game_result.delta = user_a_delta!
      user_b_uvu_game_result.delta = user_b_delta!
    }
    if (game_mode == GameMode.Normal) {
      const expected_outcome_user_a = this.calculate_expected_outcome(user_a.normal_mmr!, user_b.normal_mmr!)
      const expected_outcome_user_b = 1 - expected_outcome_user_a
      const new_user_a_normal_mmr = this.calculate_new_mmr(
        user_a.normal_mmr!, this.get_score(user_a_uvu_game_result.status!), expected_outcome_user_a
      )
      const new_user_b_normal_mmr = this.calculate_new_mmr(
        user_b.normal_mmr!, this.get_score(user_b_uvu_game_result.status!), expected_outcome_user_b
      )
      user_a_uvu_game_result.new_normal_mmr = new_user_a_normal_mmr
      user_b_uvu_game_result.new_normal_mmr = new_user_b_normal_mmr
    }
    const user_a_level = user_a.user_level
    const user_b_level = user_b.user_level
    this.calculate_new_level_and_xp(
      user_a_score_and_penalty,
      user_a_uvu_game_result,
      user_a_level!,
      game_duration,
      problem_rate
    )
    this.calculate_new_level_and_xp(
      user_b_score_and_penalty,
      user_b_uvu_game_result,
      user_b_level!,
      game_duration,
      problem_rate
    )
    return {
      user_a_result: user_a_uvu_game_result,
      user_b_result: user_b_uvu_game_result
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
  private get_problem_rate_factor(problem_rate: string) {
    return parseFloat(XP_PROBLEM_RATE_FACTOR!) * (9 - ('j'.charCodeAt(0) - problem_rate.charCodeAt(0)))
  }
  private calculate_new_level_and_xp(
    user_score_and_penalty: UserScoreAndPenalty,
    user_uvu_game_result: UserResult,
    user_level: UserLevel,
    game_duration: number,
    problem_rate: string) {
    const gained_xp = Math.round((user_score_and_penalty.score / 100) * this.get_base_xp(user_level.level, problem_rate) * (1 - this.penalty_factor(user_score_and_penalty, game_duration)))
    user_uvu_game_result.new_level = user_level
    user_uvu_game_result.xp_delta = gained_xp
    user_uvu_game_result.new_level.xp += gained_xp
    user_uvu_game_result.new_level.level = this.get_level(user_uvu_game_result.new_level.xp)
    user_uvu_game_result.new_level.xp_for_next_level = this.get_xp_for_next_level(user_uvu_game_result.new_level.level)
  }

  private get_xp_for_next_level(level: number) {
    const xp_for_next_level = Math.pow((level + 1) / parseFloat(LEVEL_K!), 2)
    return xp_for_next_level
  }
  private get_level(xp: number) {
    return Math.floor(parseFloat(LEVEL_K!) * Math.sqrt(xp))
  }

  private penalty_factor(user_score_and_penalty: UserScoreAndPenalty, game_duration: number) {
    return (user_score_and_penalty.penalty / (10 * user_score_and_penalty.number_of_incorrect_submissions! + game_duration))
  }

  private get_base_xp(level: number, problem_rate: string) {
    let base_xp = parseFloat(INITIAL_XP!) * Math.pow(parseFloat(GROWTH_RATE!), level)
    base_xp -= this.get_problem_rate_factor(problem_rate)
    return base_xp
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

  private get_score(uvu_user_game_status: UvUUserGameStatus) {
    if (uvu_user_game_status == UvUUserGameStatus.Win) {
      return 1;
    }
    else if (uvu_user_game_status == UvUUserGameStatus.Lose) {
      return 0;
    }
    else {
      return 0.5
    }
  }
  private calculate_expected_outcome(mmr_a: number, mmr_b: number) {
    const mmr_difference = mmr_b - mmr_a
    return 1.0 / (1.0 + 10 ** (mmr_difference / 480.0))
  }

  private calculate_new_mmr(old_mmr: number, score: number, expected_score: number) {
    const new_mmr = old_mmr + K * (score - expected_score)
    return Math.max(new_mmr, 800)
  }

  private determine_winner(user_a_score_and_penalty: UserScoreAndPenalty,
    user_b_score_and_penalty: UserScoreAndPenalty,
    user_a_uvu_game_result: UserResult,
    user_b_uvu_game_result: UserResult) {
    if (user_a_score_and_penalty.score > user_b_score_and_penalty.score) {
      user_a_uvu_game_result.status = UvUUserGameStatus.Win
      user_b_uvu_game_result.status = UvUUserGameStatus.Lose
    }
    else if (user_a_score_and_penalty.score < user_b_score_and_penalty.score) {
      user_b_uvu_game_result.status = UvUUserGameStatus.Win
      user_a_uvu_game_result.status = UvUUserGameStatus.Lose
    }
    else {
      if (user_a_score_and_penalty.penalty < user_b_score_and_penalty.penalty) {
        user_a_uvu_game_result.status = UvUUserGameStatus.Win
        user_b_uvu_game_result.status = UvUUserGameStatus.Lose
      }
      else if (user_a_score_and_penalty.penalty > user_b_score_and_penalty.penalty) {
        user_b_uvu_game_result.status = UvUUserGameStatus.Win
        user_a_uvu_game_result.status = UvUUserGameStatus.Lose
      }
      else {
        user_b_uvu_game_result.status = UvUUserGameStatus.Draw
        user_a_uvu_game_result.status = UvUUserGameStatus.Draw
      }
    }
  }
}