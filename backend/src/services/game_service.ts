import { GameFireStore } from "../game/store/game_fire_store";
import { User } from "../models/users";

export class GameService {
  game_store: IGameStore = new GameFireStore();
  create_one_v_one(users: User[]) {
    
  }
}