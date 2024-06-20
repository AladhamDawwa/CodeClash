import { User } from "../../models/users";
import { GameMode, GameType } from "../../utils/definitions/games_types";

export type OneVOneGameState = {
  id?: string | number;
  game_type: GameType;
  game_mode: GameMode;
  user_a: User;
  user_b: User;
  problem_id: string;
  duration: number;
  start_time: Date;
  end_time: Date;
  submissions: string[];
};

export interface IGameOneVOneStore {
  create(game_state: OneVOneGameState): string
  delete(game_id: string): void
  update(game_state: OneVOneGameState): OneVOneGameState
  get(game_id: string): OneVOneGameState
}