import { GameDetails, OneVOneGameDetails } from "../game_details/game_details";

export interface IGameStore {
  create(game_details: GameDetails): string
  delete(game_id: string): void
  update(game_details: GameDetails): GameDetails
  get(game_id: string): GameDetails
}