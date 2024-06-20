import { GameFireStore } from "../game/store/game_fire_store";
import { IGameStore } from "../game/store/i_game_store";
import { User } from "../models/users";

export class GameService {
  game_store: IGameStore = new GameFireStore();
  create_one_v_one(user_a: User, user_b: User): string {
    return ""
  }
}