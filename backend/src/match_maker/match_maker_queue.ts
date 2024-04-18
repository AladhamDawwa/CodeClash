import { RankTier } from "../utils/definitions/rank_tier";

export interface MatchMakerQueue {
  is_empty(rank_tier: RankTier): boolean;
  get_front(rank_tier: RankTier): { username: string; socket_id: string };
  pop(rank_tier: RankTier): void;
  push(rank_tier: RankTier, username: string, socket_id: string): void;
}
