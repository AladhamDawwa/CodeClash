import { GameUvUFireStore } from "../game/store/game_uvu_fire_store";
import { IGameUvUStore, UvUGameState } from "../game/store/i_game_uvu_store";
import { ProblemLevels } from "../models/problem_levels";
import { User, Users } from "../models/users";
import { UsersUnsolvedProblems } from "../models/users_unsolved_problems";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { ProblemPickerService } from "./problem_picker_service";
import { addMinutes, addSeconds } from 'date-fns';
import dotenv from 'dotenv'
import { UvUGameService } from "./uvu_game_service";
dotenv.config();

const { UVU_GAME_START_TIME_DELAY } = process.env;

export class GameCreationService {
  static game_uvu_store: IGameUvUStore = new GameUvUFireStore();

  static async create_uvu(username_a: string, username_b: string, game_mode: GameMode): Promise<UvUGameState> {
    const user_a = await Users.get_by_username(username_a)
    const user_b = await Users.get_by_username(username_b)
    const problem = await ProblemPickerService.pick_problem([user_a, user_b])
    const game_duration = await ProblemLevels.get_uvu_game_duration(problem?.rating!)
    const uvu_game_state = this.create_uvu_game_state(
      user_a.username!,
      user_b.username!,
      game_mode,
      problem?.id!,
      game_duration
    )
    const game_id = await this.game_uvu_store.create(uvu_game_state)
    uvu_game_state.id = game_id
    // UsersUnsolvedProblems.remove_problem(user_a.username!, problem?.id!, problem?.rating!)
    // UsersUnsolvedProblems.remove_problem(user_b.username!, problem?.id!, problem?.rating!)
    setTimeout(() => { UvUGameService.end_game(uvu_game_state) }, uvu_game_state.end_time?.getTime()! - Date.now())
    return uvu_game_state
  }

  static create_uvu_game_state(username_a: string, username_b: string, game_mode: GameMode, problem_id: string, game_duration: number): UvUGameState {
    let start_time = new Date()
    start_time = addSeconds(start_time, parseInt(UVU_GAME_START_TIME_DELAY!))
    let end_time = addMinutes(start_time, game_duration)

    const game: UvUGameState = {
      id: "asdasd",
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