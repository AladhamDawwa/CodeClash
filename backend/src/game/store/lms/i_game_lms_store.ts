import { UserResult } from "../../../services/uvu_game_service";
import { GameMode, GameType } from "../../../utils/definitions/games_types";

export type LMSGameState = {
  id?: string | number;
  game_type?: GameType;
  game_mode?: GameMode;
  usernames: string[]
  problem_id?: string;
  duration?: number;
  start_time?: Date;
  end_time?: Date;
  round: number;
  current_users_results?: Map<string, UserResult>
};

export interface IGameLMSStore {
  create(game_state: LMSGameState): Promise<string | number>
  delete(game_id: string | number): Promise<void>
  update(game_state: LMSGameState, game_id: string | number): Promise<void>
  get(game_id: string | number): Promise<LMSGameState | null>
}