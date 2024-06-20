import { GameOneVOneFireStore } from "../game/store/game_one_v_one_fire_store";
import { IGameOneVOneStore } from "../game/store/i_game_one_v_one_store";
import { User } from "../models/users";

export class GameService {
  game_one_v_one_store: IGameOneVOneStore = new GameOneVOneFireStore();
  create_one_v_one(user_a: User, user_b: User): string {
    return ""
  }
}