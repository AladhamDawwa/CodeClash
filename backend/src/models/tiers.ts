import { db } from "../firebase";
import { RankTier } from "../utils/definitions/rank_tier";

export type Tier = {
  id: string;
  name: string;
  min_mmr: number;
  max_mmr: number;
  rank_tier: RankTier
}

const converter = {
  toFirestore: (data: Tier) => {
    const { id, ...tierData } = data;
    return tierData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      name: data.name,
      min_mmr: data.min_mmr,
      max_mmr: data.max_mmr,
      rank_tier: data.rank_tier
    };
  },
};

const tiers_collection = db.tiers.withConverter(converter);

export class Tiers {
  static tiers: Tier[] = []
  static async index(): Promise<Tier[]> {
    if (this.tiers.length != 0) {
      return this.tiers
    }
    const snapshot = await tiers_collection.orderBy("min_mmr").get();
    const tiers = snapshot.docs.map((doc) => doc.data());
    this.tiers = tiers
    return tiers;
  }

} 