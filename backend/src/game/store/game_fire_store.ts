import { db } from '../../firebase'
import { GameType } from '../../utils/definitions/games_types';
import { IGameStore } from './i_game_store';



export class GameFireStore implements IGameStore {


  create(game_details: GameDetails): string {
    const game_creation_handler = this.game_creation_handlers[game_details.game_type]
    return game_creation_handler(game_details)
  }
  delete(game_id: string): void {

  }
  update(game_details: GameDetails): GameDetails {

  }
  get(game_id: string): GameDetails {
    return {}
  }

  private create_one_v_one(game_details: OneVOneGameDetails): string {
    return ""
  }

  private delete_one_v_one(game_details: OneVOneGameDetails): void {

  }

  private update_one_v_one(game_details: OneVOneGameDetails): GameDetails {

  }

}