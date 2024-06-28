import { Tiers } from "../../models/tiers";
import { User, Users } from "../../models/users";
import { UserScoreAndPenalty, UvUGameResult, UvUUserGameStatus, UvUUserResult } from "../../services/uvu_game_service";
import { RankTier } from "../../utils/definitions/rank_tier";
import { IUvUGameCalculator } from "./I_uvu_game_calculator";
const K = 32
export class EloUvUGameCalculator implements IUvUGameCalculator {
  async calculate_users_rank(
    user_a_score_and_penalty: UserScoreAndPenalty,
    user_b_score_and_penalty: UserScoreAndPenalty,
    user_a_uvu_game_result: UvUUserResult,
    user_b_uvu_game_result: UvUUserResult,
    user_a: User,
    user_b: User): Promise<UvUGameResult> {

    this.determine_winner(
      user_a_score_and_penalty,
      user_b_score_and_penalty,
      user_a_uvu_game_result,
      user_b_uvu_game_result
    )
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
    user_a_uvu_game_result: UvUUserResult,
    user_b_uvu_game_result: UvUUserResult) {
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