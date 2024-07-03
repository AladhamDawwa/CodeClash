import { TvTGameState } from "../game/store/tvt/i_game_tvt_store";
import gameTvTStore from "../game/store/uvu/game_uvu_fire_store";
import { UserLevel } from "../models/users";
import { RankTier } from "../utils/definitions/rank_tier";

export type TeamScoreAndPenalty = {
  score: number,
  penalty: number,
  team_name: string,
  number_of_incorrect_submissions?: number
}

export enum TvTTeamGameStatus {
  Win,
  Lose,
  Draw
}

export type TvTGameResult = {
  team_a_result: TvTTeamResult,
  team_b_result: TvTTeamResult,
}

export type TvTTeamResult = {
  status?: TvTTeamGameStatus,
  team_name?: string,
  delta?: number,
  new_mmr?: number
  new_tier?: RankTier,
  new_points?: number,
  new_level?: UserLevel,
  new_normal_mmr?: number
}

export class TvTGameService {
  static async get_game(game_id: string): Promise<TvTGameState | null> {
    const game = await gameTvTStore.get(game_id)
    return game
  }

  // static async submit_problem(game: TvTGameState, team_name: string, tvt_game_submission_request: UvUGameSubmissionRequest) {
  //   const judge_result = await JudgeZeroService.submit_problem_sync(
  //     game.problem_id!,
  //     uvu_game_submission_request.source_code,
  //     uvu_game_submission_request.language_id,
  //   )
  //   const submission = await Submissions.create(
  //     judge_result, game.id!, uvu_game_submission_request.source_code, uvu_game_submission_request.language_id, team_name
  //   )
  //   return submission
  // }

  // static async end_game(game: TvTGameState) {
  //   const game_exists = await gameTvTStore.game_exists(game.id as string)
  //   if (!game_exists) {
  //     return
  //   }
  //   await gameTvTStore.delete(game.id as string)
  //   const game_submissions = await Submissions.get_submissions_by_game_id(game.id!)
  //   const user_a_score_and_penalty = this.calculate_score_and_penalty(game.start_time!, game_submissions, game.username_a!)
  //   const user_b_score_and_penalty = this.calculate_score_and_penalty(game.start_time!, game_submissions, game.username_b!)
  //   const game_result = await this.calculate_game_result(user_a_score_and_penalty, user_b_score_and_penalty, game)
  //   console.log(game_result)
  //   await this.update_users_rank_and_mmr(game_result.user_a_result)
  //   await this.update_users_rank_and_mmr(game_result.user_b_result)
  //   UvUGameSocketController.send_game_result_to_users(game_result)
  //   this.clear_users_statuses(game.username_a!, game.username_b!)
  //   UvUGamesHistory.create(game, game_result)
  // }

  // static clear_users_statuses(username_a: string, username_b: string) {
  //   Users.clear_status(username_a, ["in_uvu_game", "uvu_game_id"])
  //   Users.clear_status(username_b, ["in_uvu_game", "uvu_game_id"])
  // }

  // static async update_users_rank_and_mmr(user_result: TvTTeamResult) {
  //   await Users.update({
  //     mmr: user_result.new_mmr,
  //     rank_points: user_result.new_points,
  //     rank_tier: user_result.new_tier
  //   }, user_result.username!)
  // }

  // static async calculate_game_result(user_a_score_and_penalty: TeamScoreAndPenalty, user_b_score_and_penalty: TeamScoreAndPenalty, game: TvTGameState): Promise<TvTTeamResult> {
  //   const user_a_uvu_game_result: TvTTeamResult = {
  //     username: user_a_score_and_penalty.username
  //   }
  //   const user_b_uvu_game_result: TvTTeamResult = {
  //     username: user_b_score_and_penalty.username
  //   }

  //   const uvu_game_result = new EloUvUGameCalculator().calculate(
  //     user_a_score_and_penalty,
  //     user_b_score_and_penalty,
  //     user_a_uvu_game_result,
  //     user_b_uvu_game_result,
  //     game.game_mode!,
  //     await Problems.get_problem_rate(game.problem_id!),
  //     await Users.get_by_username(user_a_score_and_penalty.username),
  //     await Users.get_by_username(user_b_score_and_penalty.username)
  //   )

  //   return uvu_game_result
  // }


  // static calculate_score_and_penalty(game_start_time: Date, game_submissions: Submission[], username: string): TeamScoreAndPenalty {
  //   const user_score_and_penalty: TeamScoreAndPenalty = {
  //     score: 0,
  //     penalty: 0,
  //     username: username,
  //     number_of_incorrect_submissions: 0
  //   }
  //   const index_of_max_score = this.get_max_score_index(game_submissions, username)
  //   this.calculate_score_and_penalty_given_max_score_index(game_start_time, game_submissions, index_of_max_score, user_score_and_penalty)
  //   return user_score_and_penalty
  // }

  // static calculate_score_and_penalty_given_max_score_index(
  //   game_start_time: Date,
  //   game_submissions: Submission[],
  //   index_of_max_score: number,
  //   user_score_and_penalty: TeamScoreAndPenalty) {
  //   if (index_of_max_score == -1) {
  //     return
  //   }
  //   user_score_and_penalty.score = game_submissions[index_of_max_score].score!
  //   user_score_and_penalty.penalty = (differenceInSeconds(game_submissions[index_of_max_score].submission_time!, game_start_time) / 60)
  //   for (let i = 0; i < index_of_max_score; i++) {
  //     const game_submission = game_submissions[i]
  //     if (game_submission.username == user_score_and_penalty.username && game_submission.status != SubmissionStatus.CompilationError) {
  //       const submission_penalty = (10 * ((100 - game_submission.score!) / 100))
  //       user_score_and_penalty.number_of_incorrect_submissions! += 1
  //       user_score_and_penalty.penalty += submission_penalty
  //     }
  //   }
  // }

  // static get_max_score_index(game_submissions: Submission[], username: string): number {
  //   let index_of_max_score = -1;

  //   for (let i = 0; i < game_submissions.length; i++) {
  //     const game_submission = game_submissions[i]
  //     if (game_submission.username == username && game_submission.status != SubmissionStatus.CompilationError) {
  //       if (index_of_max_score == -1) {
  //         index_of_max_score = i
  //       } else {
  //         if (game_submission.score! > game_submissions[index_of_max_score].score!) {
  //           index_of_max_score = i
  //         }
  //       }
  //     }
  //   }
  //   return index_of_max_score
  // }

  // static is_submision_time_valid(uvu_game_submission_request: UvUGameSubmissionRequest, game: TvTGameState): boolean {
  //   const submission_time = uvu_game_submission_request.submission_time
  //   const start_time = game.start_time!
  //   const end_time = game.end_time!

  //   if (submission_time! >= start_time! && submission_time! <= end_time!) {
  //     return true
  //   }
  //   return false
  // }

}