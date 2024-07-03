import { GameMode, GameType } from "../../../utils/definitions/games_types";

export type TvTGameState = {
  id?: string | number;
  game_type?: GameType;
  game_mode?: GameMode;
  team_a?: string;
  team_b?: string;
  problem_id?: string;
  duration?: number;
  start_time?: Date;
  end_time?: Date;
  submissions?: string[];
};

export interface IGameTvTStore {
  create(game_state: TvTGameState): Promise<string | number>
  delete(game_id: string | number): Promise<void>
  update(game_state: TvTGameState, game_id: string | number): Promise<void>
  get(game_id: string | number): Promise<TvTGameState | null>
}