import { differenceInSeconds } from 'date-fns';
import { LMSGameCalculator } from "../game/evaluator/elo_lms_game_calculator";
import { ILMSGameCalculator } from "../game/evaluator/i_lms_game_calculator";
import lmsGameStore from "../game/store/lms/game_lms_fire_store";
import { LMSGameState } from "../game/store/lms/i_game_lms_store";
import { Submission, Submissions } from "../models/submissions";
import { Users } from "../models/users";
import { LMSGameSocketController, LMSGameSubmissionRequest } from "../socket_controllers/lms_game";
import { GameCreationService } from "./game_creation_service";
import { JudgeZeroService, SubmissionStatus } from "./judge/judge_zero_service";

export type UserScoreAndPenalty = {
  score: number,
  penalty: number,
  username: string,
  number_of_incorrect_submissions?: number
}

export class LMSGameService {
  static lms_game_calculator: ILMSGameCalculator = new LMSGameCalculator()
  static async get_game(game_id: string): Promise<LMSGameState | null> {
    const game = await lmsGameStore.get(game_id)
    return game
  }

  static async submit_problem(game: LMSGameState, username: string, lms_game_submission_request: LMSGameSubmissionRequest) {
    const judge_result = await JudgeZeroService.submit_problem_sync(
      game.problem_id!,
      lms_game_submission_request.source_code,
      lms_game_submission_request.language_id,
    )
    const submission = await Submissions.create(
      judge_result, game.id!, lms_game_submission_request.source_code, lms_game_submission_request.language_id, username, game.round
    )
    this.should_finish_round(game)
    return submission
  }

  static async should_finish_round(game: LMSGameState) {
    const current_game = await lmsGameStore.get(game.id as string)
    if (!current_game || (current_game && current_game.round != game.round)) {
      return
    }
    const game_submissions = await Submissions.get_submissions_by_game_id_and_round(game.id!, game.round)
    const users_score_and_penalty: Map<string, UserScoreAndPenalty> = new Map<string, UserScoreAndPenalty>()
    for (const username of game.usernames) {
      users_score_and_penalty.set(username, this.calculate_score_and_penalty(game.start_time!, game_submissions, username))
    }
    let should_finish = true
    let cnt_of_acc = 0
    for (const [_, user_score_and_penalty] of users_score_and_penalty) {
      if (user_score_and_penalty.score !== 100) {
        should_finish = false
      } else {
        cnt_of_acc++
      }
    }
    if (should_finish || (cnt_of_acc == 1 && game.usernames.length == 2)) {
      this.end_round(game, game.round)
    }

  }

  static async end_round(game: LMSGameState, round: number = 1) {
    const current_game = await lmsGameStore.get(game.id as string)
    if (!current_game || (current_game && current_game.round != round)) {
      return
    }
    console.log(`before round ${round}`, game)
    const game_submissions = await Submissions.get_submissions_by_game_id_and_round(game.id!, round)
    const users_score_and_penalty: Map<string, UserScoreAndPenalty> = new Map<string, UserScoreAndPenalty>()
    for (const username of game.usernames) {
      users_score_and_penalty.set(username, this.calculate_score_and_penalty(game.start_time!, game_submissions, username))
    }
    await this.lms_game_calculator.calculate(
      users_score_and_penalty,
      game
    )
    console.log(`after round ${round}`, game)
    const elimintaed_usernames = this.lms_game_calculator.calculate_eliminated_users(users_score_and_penalty)
    this.end_round_for_usernames(elimintaed_usernames, game)
    if (game.usernames.length > 1) {
      await GameCreationService.create_new_lms_round(game)
      const new_game = await lmsGameStore.get(game.id as string)
      LMSGameSocketController.send_new_round_to_users(new_game!)
    }
    else {
      this.end_round_for_usernames(game.usernames, game)
      await lmsGameStore.delete(game.id as string)
    }
  }

  static async end_round_for_usernames(usernames: string[], game: LMSGameState) {
    for (const username of usernames) {
      //  update game history for users
      const user_result = game.current_users_results!.get(username)
      Users.update_user_level_and_xp(user_result?.new_level!, username)
      Users.update_users_rank_and_mmr(user_result!, username)
      this.clear_users_statuses(username)
      LMSGameSocketController.send_game_result_to_user(user_result!)
      game.current_users_results!.delete(username)
      game.usernames = game.usernames.filter(user => user != username)
    }
  }

  static clear_users_statuses(username: string) {
    Users.clear_status(username, ["in_game", "game_id", "game_type", "game_mode"])
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
  static is_submision_time_valid(lms_game_submission_request: LMSGameSubmissionRequest, game: LMSGameState): boolean {
    const submission_time = lms_game_submission_request.submission_time
    const start_time = game.start_time!
    const end_time = game.end_time!

    if (submission_time! >= start_time! && submission_time! <= end_time! && (lms_game_submission_request.round == game.round)) {
      return true
    }
    return false
  }

}