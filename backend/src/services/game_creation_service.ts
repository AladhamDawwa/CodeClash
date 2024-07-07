import { GameUvUFireStore } from "../game/store/uvu/game_uvu_fire_store";
import { IGameUvUStore, GameState } from "../game/store/uvu/i_game_uvu_store";
import { ProblemLevels } from "../models/problem_levels";
import { User, Users } from "../models/users";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { ProblemPickerService } from "./problem_picker_service";
import { addMinutes, addSeconds } from 'date-fns';
import dotenv from 'dotenv'
import { UserResult, UvUGameService } from "./uvu_game_service";
import { IGameLMSStore, LMSGameState } from "../game/store/lms/i_game_lms_store";
// import game_lms_fire_store, { GameLMSFireStore } from "../game/store/lms/game_lms_fire_store";
// import { IGameTvTStore, TvTGameState } from "../game/store/tvt/i_game_tvt_store";
import { GameLMSFireStore } from "../game/store/lms/game_lms_fire_store";
import { IGameTvTStore } from "../game/store/tvt/i_game_tvt_store";
import { Teams } from "../models/teams";
import { GameTvTFireStore } from "../game/store/tvt/game_tvt_fire_store";
import { UsersUnsolvedProblems } from "../models/users_unsolved_problems";
import { LMSGameService } from "./lms_game_service";
import { Problem, Problems } from "../models/problem";
import { TvTGameService } from "./tvt_game_service";
dotenv.config();

const { GAME_START_DELAY } = process.env;

export class GameCreationService {
  static game_uvu_store: IGameUvUStore = new GameUvUFireStore();
  static game_lms_store: IGameLMSStore = new GameLMSFireStore()
  static game_tvt_store: IGameTvTStore = new GameTvTFireStore();

  static async create_uvu(username_a: string, username_b: string, game_mode: GameMode): Promise<GameState> {
    const user_a = await Users.get_by_username(username_a)
    const user_b = await Users.get_by_username(username_b)
    const problem = await ProblemPickerService.pick_problem([user_a, user_b])
    const game_duration = await ProblemLevels.get_game_duration(problem!.rating!)
    const uvu_game_state = this.create_uvu_game_state(
      user_a.username!,
      user_b.username!,
      game_mode,
      problem!.id!,
      game_duration
    )
    const game_id = await this.game_uvu_store.create(uvu_game_state)
    uvu_game_state.id = game_id
    this.remove_problems_from_unsolved_problems([user_a, user_b], problem!.id!, problem!.rating!)
    setTimeout(() => { UvUGameService.end_game(uvu_game_state) }, uvu_game_state.end_time!.getTime()! - Date.now())
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
    const game_duration = await ProblemLevels.get_game_duration(problem!.rating!)
    const lms_game_state = await this.create_lms_game_state(
      users,
      game_mode,
      problem!.id!,
      game_duration
    )
    const game_id = await this.game_lms_store.create(lms_game_state)
    lms_game_state.id = game_id
    // this.remove_problems_from_unsolved_problems(users, problem?.id!, problem?.rating!)
    setTimeout(() => { LMSGameService.end_round(lms_game_state) }, lms_game_state.end_time!.getTime()! - Date.now())
    this.remove_problems_from_unsolved_problems(users, problem!.id!, problem!.rating!)
    // a set time out
    this.update_users_statuses(game_id as string, users, GameType.LastManStanding, game_mode)
    return lms_game_state
  }

  static remove_problems_from_unsolved_problems(users: User[], problem_id: string, problem_rating: string) {
    for (const user of users) {
      UsersUnsolvedProblems.remove_problem(user.username!, problem_id, problem_rating)
    }
  }

  static async create_new_lms_round(lms_game_state: LMSGameState) {
    const users = await Users.get_by_usernames(lms_game_state.usernames)
    const problem = await ProblemPickerService.pick_problem(users)
    const game_duration = await ProblemLevels.get_game_duration(problem!.rating!)
    this.update_lms_game_state(problem!, game_duration, lms_game_state)
    await this.game_lms_store.update(lms_game_state, lms_game_state.id!)
    setTimeout(() => { LMSGameService.end_round(lms_game_state, lms_game_state.round) }, lms_game_state.end_time!.getTime()! - Date.now())
  }

  static update_lms_game_state(problem: Problem, game_duration: number, lms_game_state: LMSGameState) {
    lms_game_state.duration = game_duration
    lms_game_state.problem_id = problem.id
    let start_time = new Date()
    start_time = addSeconds(start_time, parseInt(GAME_START_DELAY!))
    const end_time = addMinutes(start_time, game_duration)
    lms_game_state.start_time = start_time
    lms_game_state.end_time = end_time
    lms_game_state.round += 1
  }

  static async create_lms_game_state(users: User[], game_mode: GameMode, problem_id: string, game_duration: number): Promise<LMSGameState> {
    let start_time = new Date()
    start_time = addSeconds(start_time, parseInt(GAME_START_DELAY!))
    const end_time = addMinutes(start_time, game_duration)
    const current_users_results = new Map<string, UserResult>()
    for (const user of users) {
      current_users_results.set(user.username!, {
        username: user.username,
        delta: 0,
        new_mmr: user.mmr,
        new_tier: user.rank_tier,
        new_points: user.rank_points,
        new_level: user.user_level,
        xp_delta: 0
      })
    }
    const game: LMSGameState = {
      usernames: users.map(user => user.username!),
      game_mode: game_mode,
      game_type: GameType.LastManStanding,
      problem_id: problem_id,
      duration: game_duration,
      start_time: start_time,
      end_time: end_time,
      round: 1,
      current_users_results: current_users_results
    }

    return game
  }

  // static create_uvu_game_state(username_a: string, username_b: string, game_mode: GameMode, problem_id: string, game_duration: number): GameState {
  //   let start_time = new Date()
  //   start_time = addSeconds(start_time, parseInt(GAME_START_DELAY!))
  //   let end_time = addMinutes(start_time, game_duration)
  //   // UsersUnsolvedProblems.remove_problem(user_a.username!, problem?.id!, problem?.rating!)
  //   // UsersUnsolvedProblems.remove_problem(user_b.username!, problem?.id!, problem?.rating!)
  //   setTimeout(() => { UvUGameService.end_game(uvu_game_state) }, uvu_game_state.end_time!.getTime()! - Date.now())
  //   this.update_users_statuses(game_id as string, username_a, username_b)
  //   return uvu_game_state
  // }

  static async create_tvt(team_name_a: string, team_name_b: string, game_mode: GameMode): Promise<GameState> {
    const team_a = await Teams.get_by_team_name(team_name_a)
    const team_b = await Teams.get_by_team_name(team_name_b)
    let game_members_names: string[] = [];
    game_members_names = game_members_names.concat(team_a.members, team_b.members);
    const game_members = await Promise.all(game_members_names.map(async (username) => {
      return await Users.get_by_username(username)
    }));
    const problem = await ProblemPickerService.pick_problem(game_members)
    const game_duration = await ProblemLevels.get_game_duration(problem!.rating!)
    const tvt_game_state = this.create_tvt_game_state(
      team_a.team_name!,
      team_b.team_name!,
      game_mode,
      problem!.id!,
      game_duration
    )
    const game_id = await this.game_tvt_store.create(tvt_game_state)
    tvt_game_state.id = game_id

    // team_a.members.forEach(async (username) => {
    //   UsersUnsolvedProblems.remove_problem(username, problem?.id!, problem?.rating!)
    // })

    // team_b.members.forEach(async (username) => {
    //   UsersUnsolvedProblems.remove_problem(username, problem?.id!, problem?.rating!)
    // })

    setTimeout(() => { TvTGameService.end_game(tvt_game_state) }, tvt_game_state.end_time!.getTime()! - Date.now())

    this.update_users_statuses(game_id as string, game_members, GameType.TeamVsTeam, game_mode)

    return tvt_game_state;
  }

  static create_uvu_game_state(username_a: string, username_b: string, game_mode: GameMode, problem_id: string, game_duration: number): GameState {
    let start_time = new Date()
    start_time = addSeconds(start_time, parseInt(GAME_START_DELAY!))
    const end_time = addMinutes(start_time, game_duration)

    const game: GameState = {
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

  static create_tvt_game_state(team_name_a: string, team_name_b: string, game_mode: GameMode, problem_id: string, game_duration: number): GameState {
    let start_time = new Date()
    start_time = addSeconds(start_time, parseInt(GAME_START_DELAY!))
    const end_time = addMinutes(start_time, game_duration)

    const game: GameState = {
      username_a: team_name_a,
      username_b: team_name_b,
      game_mode: game_mode,
      game_type: GameType.TeamVsTeam,
      problem_id: problem_id,
      duration: game_duration,
      start_time: start_time,
      end_time: end_time,
      submissions: []
    }

    return game
  }

}