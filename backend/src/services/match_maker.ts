import { MatchMakerQueue } from "../match_maker/match_maker_queue";
import { MatchMakerQueueLocal } from "../match_maker/match_maker_queue_local";
import { Users } from "../models/users";
import { RankTier } from "../utils/definitions/rank_tier";
import { UserSocketInfo } from "../utils/definitions/user_socket_info";

export class MatchMakerService {
  static match_maker_queue: MatchMakerQueue = new MatchMakerQueueLocal();

  static async find_one_v_one(user_socket_info: UserSocketInfo) {
    const user_rank: RankTier = await Users.get_rank(user_socket_info.username);
    if (this.match_maker_queue.is_empty(user_rank)) {
      this.match_maker_queue.push(user_rank, user_socket_info);
      return null;
    }
    const matched_user_socket_info =
      this.match_maker_queue.get_front(user_rank);
    this.match_maker_queue.pop(user_rank);
    return [
      user_socket_info,
      matched_user_socket_info,
    ];
  }
}
