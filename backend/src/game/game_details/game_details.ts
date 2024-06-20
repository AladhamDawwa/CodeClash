import { User } from "../../models/users";
import { GameMode, GameType } from "../../utils/definitions/games_types"

export type OneVOneGameDetails = {
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