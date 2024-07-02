import { IUvUMatchMakerQueue } from "../match_maker/queue/uvu/i_uvu_match_maker_queue";
import { UvUNormalMatchMakerQueueLocal } from "../match_maker/queue/uvu/uvu_normal_match_maker_queue_local";
import { UvURankedMatchMakerQueueLocal } from "../match_maker/queue/uvu/uvu_ranked_match_maker_queue_local";
import { User, Users } from "../models/users";
import { GameMode } from "../utils/definitions/games_types";
import { MatchMakerRequest, MatchMakerResponse } from "../utils/definitions/match_maker";

export class MatchMakerService {
  static uvu_ranked_match_maker_queue: IUvUMatchMakerQueue = new UvURankedMatchMakerQueueLocal();
  static uvu_normal_match_maker_queue: IUvUMatchMakerQueue = new UvUNormalMatchMakerQueueLocal()

  static async find_uvu(match_maker_request: MatchMakerRequest): Promise<MatchMakerResponse> {
    const user = await Users.get_by_username(match_maker_request.username!);
    const target_match_maker_queue = (match_maker_request.game_mode == GameMode.Normal ? this.uvu_normal_match_maker_queue : this.uvu_ranked_match_maker_queue)
    console.log(target_match_maker_queue.get_all_data())
    const matched_user = target_match_maker_queue.find_best(user);

    if (matched_user) {
      const match_maker_response: MatchMakerResponse = {
        status: "MatchFound",
        user: matched_user
      }
      return match_maker_response;
    }
    target_match_maker_queue.push(user);
    return {
      status: "InQueue"
    };
  }

  static async handle_disconnection(username: string) {
    const user = await Users.get_by_username(username)
    this.uvu_ranked_match_maker_queue.remove(user)
    this.uvu_normal_match_maker_queue.remove(user)
  }
}
