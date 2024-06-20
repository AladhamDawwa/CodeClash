import { db } from "../firebase";

export type Tier = {
  id: string;
  name: string;
  min_mmr: number;
  max_mmr: number
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
      max_mmr: data.max_mmr
    };
  },
};

const tiers_collection = db.tiers.withConverter(converter);

export class Tiers {

  static async index(): Promise<Tier[]> {
    const snapshot = await tiers_collection.get();
    const tiers = snapshot.docs.map((doc) => doc.data());
    return tiers;
  }

} 