import { User } from "../../models/users"
import { GameMode, GameType } from "./games_types"

export type MatchMakerRequest = {
  game_type?: GameType,
  game_mode?: GameMode,
  username?: string
}

export type MatchMakerResponse = {
  status?: string,
  user?: User
}