import { GameUvUFireStore } from "../game/store/uvu/game_uvu_fire_store";
import { IGameUvUStore, UvUGameState } from "../game/store/uvu/i_game_uvu_store";
import { ProblemLevels } from "../models/problem_levels";
import { User, Users } from "../models/users";
import { UsersUnsolvedProblems } from "../models/users_unsolved_problems";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { ProblemPickerService } from "./problem_picker_service";
import { addMinutes, addSeconds } from 'date-fns';
import dotenv from 'dotenv'
import { UvUGameService } from "./uvu_game_service";
import { IGameLMSStore, LMSGameState } from "../game/store/lms/i_game_lms_store";
import { GameLMSFireStore } from "../game/store/lms/game_lms_fire_store";
dotenv.config();

const { GAME_START_DELAY } = process.env;

export class GameCreationService {
  static game_uvu_store: IGameUvUStore = new GameUvUFireStore();
  static game_lms_store: IGameLMSStore = new GameLMSFireStore()

  static async create_uvu(username_a: string, username_b: string, game_mode: GameMode): Promise<UvUGameState> {
    const user_a = await Users.get_by_username(username_a)
    const user_b = await Users.get_by_username(username_b)
    const problem = await ProblemPickerService.pick_problem([user_a, user_b])
    const game_duration = await ProblemLevels.get_game_duration(problem?.rating!)
    const uvu_game_state = this.create_uvu_game_state(
      user_a.username!,
      user_b.username!,
      game_mode,
      problem?.id!,
      game_duration
    )
    const game_id = await this.game_uvu_store.create(uvu_game_state)
    uvu_game_state.id = game_id
    // this.remove_problems_from_unsolved_problems([user_a, user_b], problem?.id!, problem?.rating!)
    setTimeout(() => { UvUGameService.end_game(uvu_game_state) }, uvu_game_state.end_time?.getTime()! - Date.now())
    this.update_users_statuses(game_id as string, [user_a, user_b], GameType.OneVsOne, game_mode)
    return uvu_game_state
  }

  static update_users_statuses(game_id: string, users: User[], game_type: GameType, game_mode: GameMode) {
    for (const user of users) {
      Users.update({
        status: {
          in_game: true,
          game_id: game_id,
          game_type: game_type,
          game_mode: game_mode
        }
      }, user.username!)
    }
  }

  static async create_lms(users: User[], game_mode: GameMode): Promise<LMSGameState> {
    const problem = await ProblemPickerService.pick_problem(users)
    const game_duration = await ProblemLevels.get_game_duration(problem?.rating!)
    const lms_game_state = this.create_lms_game_state(
      users,
      game_mode,
      problem?.id!,
      game_duration
    )
    const game_id = await this.game_lms_store.create(lms_game_state)
    lms_game_state.id = game_id
    // this.remove_problems_from_unsolved_problems(users, problem?.id!, problem?.rating!)
    // a set time out
    this.update_users_statuses(game_id as string, users, GameType.LastManStanding, game_mode)
    return lms_game_state
  }

  static remove_problems_from_unsolved_problems(users: User[], problem_id: string, problem_rating: string) {
    for (const user of users) {
      UsersUnsolvedProblems.remove_problem(user.username!, problem_id, problem_rating)
    }
  }

  static create_lms_game_state(users: User[], game_mode: GameMode, problem_id: string, game_duration: number): LMSGameState {
    let start_time = new Date()
    start_time = addSeconds(start_time, parseInt(GAME_START_DELAY!))
    let end_time = addMinutes(start_time, game_duration)

    const game: LMSGameState = {
      usernames: users.map(user => user.username!),
      game_mode: game_mode,
      game_type: GameType.LastManStanding,
      problem_id: problem_id,
      duration: game_duration,
      start_time: start_time,
      end_time: end_time,
      round: 1,
      current_users_results: []
    }

    return game
  }

  static create_uvu_game_state(username_a: string, username_b: string, game_mode: GameMode, problem_id: string, game_duration: number): UvUGameState {
    let start_time = new Date()
    start_time = addSeconds(start_time, parseInt(GAME_START_DELAY!))
    let end_time = addMinutes(start_time, game_duration)

    const game: UvUGameState = {
      username_a: username_a,
      username_b: username_b,
      game_mode: game_mode,
      game_type: GameType.OneVsOne,
      problem_id: problem_id,
      duration: game_duration,
      start_time: start_time,
      end_time: end_time,
      submissions: []
    }

    return game
  }

}