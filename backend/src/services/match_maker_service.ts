import { IMatchMakerQueue } from "../match_maker/queue/i_match_maker_queue";
import { MatchMakerQueueLocal } from "../match_maker/queue/match_maker_queue_local";
import { User, Users } from "../models/users";
import { MatchMakerRequest, MatchMakerResponse } from "../utils/definitions/match_maker";

export class MatchMakerService {
  static match_maker_queue: IMatchMakerQueue = new MatchMakerQueueLocal();

  static async find_one_v_one(match_maker_request: MatchMakerRequest): Promise<MatchMakerResponse> {
    const user = await Users.get_by_username(match_maker_request.username!);
    const matched_user = this.match_maker_queue.find_best(user);
    if (matched_user) {
      const match_maker_response: MatchMakerResponse = {
        status: "MatchFound",
        user: matched_user
      }
      return match_maker_response;
    }
    this.match_maker_queue.push(user);
    return {
      status: "InQueue"
    };
  }

  static async handle_disconnection(username: string) {
    const user = await Users.get_by_username(username)
    this.match_maker_queue.remove(user)
  }
}
