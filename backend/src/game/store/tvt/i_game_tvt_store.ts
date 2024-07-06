import { GameState } from "../uvu/i_game_uvu_store";

// export type TvTGameState = {
//   id?: string | number;
//   game_type?: GameType;
//   game_mode?: GameMode;
//   username_a?: string;
//   username_b?: string;
//   problem_id?: string;
//   duration?: number;
//   start_time?: Date;
//   end_time?: Date;
//   submissions?: string[];
// };

export interface IGameTvTStore {
  create(game_state: GameState): Promise<string | number>
  delete(game_id: string | number): Promise<void>
  update(game_state: GameState, game_id: string | number): Promise<void>
  get(game_id: string | number): Promise<GameState | null>
}