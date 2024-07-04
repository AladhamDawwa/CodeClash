import { Team } from "../../models/teams"
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

export type LMSMatchMakerResponse = {
  status?: string,
  users?: User[]
}

export type TeamMatchMakerRequest = {
  game_type: GameType,
  game_mode: GameMode,
  team_name: string
}

export type TeamMatchMakerResponse = {
  status?: string,
  team?: Team
}