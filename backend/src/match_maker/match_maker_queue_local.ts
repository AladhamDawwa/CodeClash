import { RankTier } from "../utils/definitions/rank_tier";
import { MatchMakerQueue } from "./match_maker_queue";
import { Queue } from "queue-typescript";

export class MatchMakerQueueLocal implements MatchMakerQueue {
  private queues;
  constructor() {
    this.queues = new Map<
      RankTier,
      Queue<{ username: string; socket_id: string }>
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
  get_front(rank_tier: RankTier): { username: string; socket_id: string } {
    return this.queues.get(rank_tier)?.front!;
  }

  pop(rank_tier: RankTier) {
    this.queues.get(rank_tier)?.dequeue();
  }

  push(rank_tier: RankTier, username: string, socket_id: string): void {
    if (this.queues.get(rank_tier) == undefined) {
      this.queues.set(
        rank_tier,
        new Queue<{ username: string; socket_id: string }>(),
      );
    }
    this.queues
      .get(rank_tier)
      ?.enqueue({ username: username, socket_id: socket_id });
  }
}
