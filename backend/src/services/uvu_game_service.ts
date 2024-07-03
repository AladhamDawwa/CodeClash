import { EloUvUGameCalculator } from "../game/evaluator/elo_uvu_game_calculator";
import gameUvUStore from "../game/store/uvu/game_uvu_fire_store";
import { UvUGameState } from "../game/store/uvu/i_game_uvu_store";
import { Problems } from "../models/problem";
import { Submission, Submissions } from "../models/submissions";
import { UserLevel, Users } from "../models/users";
import { UvUGamesHistory } from "../models/uvu_game_history";
import { UvUGameSocketController, UvUGameSubmissionRequest } from "../socket_controllers/uvu_game";
import { GameMode } from "../utils/definitions/games_types";
import { RankTier } from "../utils/definitions/rank_tier";
import { JudgeZeroService, SubmissionStatus } from "./judge/judge_zero_service";
import { differenceInSeconds } from 'date-fns';

export type UserScoreAndPenalty = {
  score: number,
  penalty: number,
  username: string,
  number_of_incorrect_submissions?: number
}

export enum UvUUserGameStatus {
  Win,
  Lose,
  Draw
}

export type UvUGameResult = {
  user_a_result: UserResult,
  user_b_result: UserResult,
}

export type UserResult = {
  status?: UvUUserGameStatus,
  username?: string,
  delta?: number,
  new_mmr?: number
  new_tier?: RankTier,
  new_points?: number,
  new_level?: UserLevel,
  new_normal_mmr?: number,
  xp_delta?: number
}

export class UvUGameService {
  static async get_game(game_id: string): Promise<UvUGameState | null> {
    const game = await gameUvUStore.get(game_id)
    return game
  }

  static async submit_problem(game: UvUGameState, username: string, uvu_game_submission_request: UvUGameSubmissionRequest) {
    const judge_result = await JudgeZeroService.submit_problem_sync(
      game.problem_id!,
      uvu_game_submission_request.source_code,
      uvu_game_submission_request.language_id,
    )
    const submission = await Submissions.create(
      judge_result, game.id!, uvu_game_submission_request.source_code, uvu_game_submission_request.language_id, username
    )
    return submission
  }

  static async end_game(game: UvUGameState) {
    const game_exists = await gameUvUStore.game_exists(game.id as string)
    if (!game_exists) {
      return
    }
    await gameUvUStore.delete(game.id as string)
    const game_submissions = await Submissions.get_submissions_by_game_id(game.id!)
    const user_a_score_and_penalty = this.calculate_score_and_penalty(game.start_time!, game_submissions, game.username_a!)
    const user_b_score_and_penalty = this.calculate_score_and_penalty(game.start_time!, game_submissions, game.username_b!)
    const game_result = await this.calculate_game_result(user_a_score_and_penalty, user_b_score_and_penalty, game)
    console.log(game_result)
    if (game.game_mode == GameMode.Ranked) {
      await this.update_users_rank_and_mmr(game_result.user_a_result)
      await this.update_users_rank_and_mmr(game_result.user_b_result)
    }
    if (game.game_mode == GameMode.Normal) {
      await Users.update({ normal_mmr: game_result.user_a_result.new_normal_mmr }, game_result.user_a_result.username!)
      await Users.update({ normal_mmr: game_result.user_b_result.new_normal_mmr }, game_result.user_b_result.username!)
    }
    this.update_user_level_and_xp(game_result.user_a_result.new_level!, game_result.user_a_result.username!)
    this.update_user_level_and_xp(game_result.user_b_result.new_level!, game_result.user_b_result.username!)
    UvUGameSocketController.send_game_result_to_users(game_result)
    this.clear_users_statuses(game.username_a!, game.username_b!)
    UvUGamesHistory.create(game, game_result)
  }

  static update_user_level_and_xp(user_level: UserLevel, username: string) {
    switch (user_level.rating) {
      case 'a':
        Users.update({ user_level_a: user_level }, username)
        break
      case 'b':
        Users.update({ user_level_b: user_level }, username)
        break
      case 'c':
        Users.update({ user_level_c: user_level }, username)
        break
      case 'd':
        Users.update({ user_level_d: user_level }, username)
        break
      case 'e':
        Users.update({ user_level_e: user_level }, username)
        break
      case 'f':
        Users.update({ user_level_f: user_level }, username)
        break
      case 'g':
        Users.update({ user_level_g: user_level }, username)
        break
      case 'h':
        Users.update({ user_level_h: user_level }, username)
        break
      case 'i':
        Users.update({ user_level_i: user_level }, username)
        break
      case 'j':
        Users.update({ user_level_j: user_level }, username)
        break
    }
  }
  static clear_users_statuses(username_a: string, username_b: string) {
    Users.clear_status(username_a, ["in_uvu_game", "uvu_game_id"])
    Users.clear_status(username_b, ["in_uvu_game", "uvu_game_id"])
  }

  static async update_users_rank_and_mmr(user_result: UserResult) {
    await Users.update({
      mmr: user_result.new_mmr,
      rank_points: user_result.new_points,
      rank_tier: user_result.new_tier
    }, user_result.username!)
  }

  static async calculate_game_result(user_a_score_and_penalty: UserScoreAndPenalty, user_b_score_and_penalty: UserScoreAndPenalty, game: UvUGameState): Promise<UvUGameResult> {
    const user_a_uvu_game_result: UserResult = {
      username: user_a_score_and_penalty.username
    }
    const user_b_uvu_game_result: UserResult = {
      username: user_b_score_and_penalty.username
    }

    const uvu_game_result = new EloUvUGameCalculator().calculate(
      user_a_score_and_penalty,
      user_b_score_and_penalty,
      user_a_uvu_game_result,
      user_b_uvu_game_result,
      game.game_mode!,
      game.duration!,
      await Problems.get_problem_rate(game.problem_id!),
      await Users.get_by_username(user_a_score_and_penalty.username),
      await Users.get_by_username(user_b_score_and_penalty.username)
    )

    return uvu_game_result
  }


  static calculate_score_and_penalty(game_start_time: Date, game_submissions: Submission[], username: string): UserScoreAndPenalty {
    const user_score_and_penalty: UserScoreAndPenalty = {
      score: 0,
      penalty: 0,
      username: username,
      number_of_incorrect_submissions: 0
    }
    const index_of_max_score = this.get_max_score_index(game_submissions, username)
    this.calculate_score_and_penalty_given_max_score_index(game_start_time, game_submissions, index_of_max_score, user_score_and_penalty)
    return user_score_and_penalty
  }

  static calculate_score_and_penalty_given_max_score_index(
    game_start_time: Date,
    game_submissions: Submission[],
    index_of_max_score: number,
    user_score_and_penalty: UserScoreAndPenalty) {
    if (index_of_max_score == -1) {
      return
    }
    user_score_and_penalty.score = game_submissions[index_of_max_score].score!
    user_score_and_penalty.penalty = (differenceInSeconds(game_submissions[index_of_max_score].submission_time!, game_start_time) / 60)
    for (let i = 0; i < index_of_max_score; i++) {
      const game_submission = game_submissions[i]
      if (game_submission.username == user_score_and_penalty.username && game_submission.status != SubmissionStatus.CompilationError) {
        const submission_penalty = (10 * ((100 - game_submission.score!) / 100))
        user_score_and_penalty.number_of_incorrect_submissions! += 1
        user_score_and_penalty.penalty += submission_penalty
      }
    }
  }

  static get_max_score_index(game_submissions: Submission[], username: string): number {
    let index_of_max_score = -1;

    for (let i = 0; i < game_submissions.length; i++) {
      const game_submission = game_submissions[i]
      if (game_submission.username == username && game_submission.status != SubmissionStatus.CompilationError) {
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
  static is_submision_time_valid(uvu_game_submission_request: UvUGameSubmissionRequest, game: UvUGameState): boolean {
    const submission_time = uvu_game_submission_request.submission_time
    const start_time = game.start_time!
    const end_time = game.end_time!

    if (submission_time! >= start_time! && submission_time! <= end_time!) {
      return true
    }
    return false
  }

}