import { MatchMakerQueue } from "../match_maker/match_maker_queue";
import { MatchMakerQueueLocal } from "../match_maker/match_maker_queue_local";
import { Users } from "../models/users";
import { RankTier } from "../utils/definitions/rank_tier";

export class MatchMakerService {
  static match_maker_queue: MatchMakerQueue = new MatchMakerQueueLocal();

  static async find_one_v_one(username: string, socket_id: string) {
    const user_rank: RankTier = await Users.get_rank(username);
    if (this.match_maker_queue.is_empty(user_rank)) {
      this.match_maker_queue.push(user_rank, username, socket_id);
      return null;
    }
    const matched_user_socket_info =
      this.match_maker_queue.get_front(user_rank);
    this.match_maker_queue.pop(user_rank);
    return [
      { username: username, socket_id: socket_id },
      matched_user_socket_info,
    ];
  }
}
