import { differenceInSeconds } from "date-fns";
import gameTvTStore from "../game/store/tvt/game_tvt_fire_store";
import { GameState } from "../game/store/uvu/i_game_uvu_store";
import { Submission, Submissions } from "../models/submissions";
import { UserLevel } from "../models/users";
import { GameSubmissionRequest } from "../socket_controllers/uvu_game";
import { RankTier } from "../utils/definitions/rank_tier";
import { JudgeZeroService, SubmissionStatus } from "./judge/judge_zero_service";
import { Teams } from "../models/teams";
import { TvTGameSocketController } from "../socket_controllers/tvt_game";
import { EloTvTGameCalculator } from "../game/evaluator/elo_tvt_game_calculator";
import { Problems } from "../models/problem";

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
  xp_delta?: number
}

export class TvTGameService {
  static async get_game(game_id: string): Promise<GameState | null> {
    const game = await gameTvTStore.get(game_id)
    return game
  }

  static async submit_problem(game: GameState, team_name: string, tvt_game_submission_request: GameSubmissionRequest) {
    const judge_result = await JudgeZeroService.submit_problem_sync(
      game.problem_id!,
      tvt_game_submission_request.source_code,
      tvt_game_submission_request.language_id,
    )
    const submission = await Submissions.create(
      judge_result, game.id!, tvt_game_submission_request.source_code, tvt_game_submission_request.language_id, team_name
    )
    return submission
  }

  static async end_game(game: GameState) {
    const game_exists = await gameTvTStore.game_exists(game.id as string)
    if (!game_exists) {
      return
    }
    await gameTvTStore.delete(game.id as string)
    const game_submissions = await Submissions.get_submissions_by_game_id(game.id!)
    const user_a_score_and_penalty = this.calculate_score_and_penalty(game.start_time!, game_submissions, game.username_a!)
    const user_b_score_and_penalty = this.calculate_score_and_penalty(game.start_time!, game_submissions, game.username_b!)
    const game_result = await this.calculate_game_result(user_a_score_and_penalty, user_b_score_and_penalty, game)
    console.log(game_result)
    await this.update_teams_rank_and_mmr(game_result.team_a_result)
    await this.update_teams_rank_and_mmr(game_result.team_b_result)
    TvTGameSocketController.send_game_result_to_teams(game_result)
    // this.clear_users_statuses(game.username_a!, game.username_b!)
    // UvUGamesHistory.create(game, game_result)
  }

  // static clear_users_statuses(team_a: string, team_b: string) {

  // Users.clear_status(username_a, ["in_uvu_game", "uvu_game_id"])
  // Users.clear_status(username_b, ["in_uvu_game", "uvu_game_id"])
  // }

  static async update_teams_rank_and_mmr(user_result: TvTTeamResult) {
    const team = await Teams.get_by_team_name(user_result.team_name!);
    await Teams.update({
      ...team,
      mmr: user_result.new_mmr!,
      rank_points: user_result.new_points!,
      rank_tier: user_result.new_tier!
    }, user_result.team_name!)
  }

  static async calculate_game_result(user_a_score_and_penalty: TeamScoreAndPenalty, user_b_score_and_penalty: TeamScoreAndPenalty, game: GameState): Promise<TvTGameResult> {
    const user_a_uvu_game_result: TvTTeamResult = {
      team_name: user_a_score_and_penalty.team_name
    }
    const user_b_uvu_game_result: TvTTeamResult = {
      team_name: user_b_score_and_penalty.team_name
    }

    const tvt_game_result = new EloTvTGameCalculator().calculate(
      user_a_score_and_penalty,
      user_b_score_and_penalty,
      user_a_uvu_game_result,
      user_b_uvu_game_result,
      game.game_mode!,
      game.duration!,
      await Problems.get_problem_rate(game.problem_id!),
      await Teams.get_by_team_name(user_a_score_and_penalty.team_name),
      await Teams.get_by_team_name(user_b_score_and_penalty.team_name)
    )

    return tvt_game_result
  }

  static calculate_score_and_penalty(game_start_time: Date, game_submissions: Submission[], team_name: string): TeamScoreAndPenalty {
    const user_score_and_penalty: TeamScoreAndPenalty = {
      score: 0,
      penalty: 0,
      team_name: team_name,
      number_of_incorrect_submissions: 0
    }
    const index_of_max_score = this.get_max_score_index(game_submissions, team_name)
    this.calculate_score_and_penalty_given_max_score_index(game_start_time, game_submissions, index_of_max_score, user_score_and_penalty)
    return user_score_and_penalty
  }

  static calculate_score_and_penalty_given_max_score_index(
    game_start_time: Date,
    game_submissions: Submission[],
    index_of_max_score: number,
    user_score_and_penalty: TeamScoreAndPenalty) {
    if (index_of_max_score == -1) {
      return
    }
    user_score_and_penalty.score = game_submissions[index_of_max_score].score!
    user_score_and_penalty.penalty = (differenceInSeconds(game_submissions[index_of_max_score].submission_time!, game_start_time) / 60)
    for (let i = 0; i < index_of_max_score; i++) {
      const game_submission = game_submissions[i]
      if (game_submission.username == user_score_and_penalty.team_name && game_submission.status != SubmissionStatus.CompilationError) {
        const submission_penalty = (10 * ((100 - game_submission.score!) / 100))
        user_score_and_penalty.number_of_incorrect_submissions! += 1
        user_score_and_penalty.penalty += submission_penalty
      }
    }
  }

  static get_max_score_index(game_submissions: Submission[], team_name: string): number {
    let index_of_max_score = -1;

    for (let i = 0; i < game_submissions.length; i++) {
      const game_submission = game_submissions[i]
      if (game_submission.username == team_name && game_submission.status != SubmissionStatus.CompilationError) {
        if (index_of_max_score == -1) {
          index_of_max_score = i
        } else {
          if (game_submission.score! > game_submissions[index_of_max_score].score!) {
            index_of_max_score = i
          }
        }
      }
    }
    return index_of_max_score
  }

  static is_submission_time_valid(tvt_game_submission_request: GameSubmissionRequest, game: GameState): boolean {
    const submission_time = tvt_game_submission_request.submission_time
    const start_time = game.start_time!
    const end_time = game.end_time!
    console.log(submission_time, start_time, end_time);

    if (submission_time! >= start_time! && submission_time! <= end_time!) {
      return true
    }
    return false
  }

}