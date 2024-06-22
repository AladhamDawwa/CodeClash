import { User } from "../../models/users";
import { GameMode, GameType } from "../../utils/definitions/games_types";

export type UvUGameState = {
  id?: string | number;
  game_type?: GameType;
  game_mode?: GameMode;
  username_a?: string;
  username_b?: string;
  problem_id?: string;
  duration?: number;
  start_time?: Date;
  end_time?: Date;
  submissions?: string[];
};

export interface IGameUvUStore {
  create(game_state: UvUGameState): Promise<string | number>
  delete(game_id: string | number): Promise<void>
  update(game_state: UvUGameState, game_id: string | number): Promise<void>
  get(game_id: string | number): Promise<UvUGameState>
}