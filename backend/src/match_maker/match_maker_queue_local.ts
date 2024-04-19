import { RankTier } from "../utils/definitions/rank_tier";
import { UserSocketInfo } from "../utils/definitions/user_socket_info";
import { MatchMakerQueue } from "./match_maker_queue";
import { Queue } from "queue-typescript";

export class MatchMakerQueueLocal implements MatchMakerQueue {
  private queues;
  constructor() {
    this.queues = new Map<
      RankTier,
      Queue<UserSocketInfo>
    >();
  }
  is_empty(rank_tier: RankTier): boolean {
    if (
      this.queues.get(rank_tier) == undefined ||
      this.queues.get(rank_tier)?.length == 0
    ) {
      return true;
    }
    return false;
  }
  get_front(rank_tier: RankTier): UserSocketInfo {
    return this.queues.get(rank_tier)?.front!;
  }

  pop(rank_tier: RankTier) {
    this.queues.get(rank_tier)?.dequeue();
  }

  push(rank_tier: RankTier, user_socket_info: UserSocketInfo): void {
    if (this.queues.get(rank_tier) == undefined) {
      this.queues.set(
        rank_tier,
        new Queue<UserSocketInfo>(),
      );
    }
    this.queues
      .get(rank_tier)
      ?.enqueue(user_socket_info);
  }
}
