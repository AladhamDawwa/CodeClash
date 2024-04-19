import { RankTier } from "../utils/definitions/rank_tier";
import { UserSocketInfo } from "../utils/definitions/user_socket_info";

export interface MatchMakerQueue {
  is_empty(rank_tier: RankTier): boolean;
  get_front(rank_tier: RankTier): UserSocketInfo;
  pop(rank_tier: RankTier): void;
  push(rank_tier: RankTier, user_socket_info: UserSocketInfo): void;
}
