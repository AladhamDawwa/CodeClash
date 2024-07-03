import { Team } from "../../../models/teams";

export interface ITvTMatchMakerQueue {
  is_empty(): boolean;
  find_best(team: Team): (Team | null)
  push(team: Team): void
  remove(user: Team): void
  get_all_data(): Team[]
}