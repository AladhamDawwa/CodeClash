import { db } from "../firebase";

export type ProblemLevel = {
  id: string;
  code: string;
  min_mmr: number;
  max_mmr: number
}

const converter = {
  toFirestore: (data: ProblemLevel) => {
    const { id, ...problemData } = data;
    return problemData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      code: data.code,
      min_mmr: data.min_mmr,
      max_mmr: data.max_mmr
    };
  },
};

const problem_levels_collection = db.problem_levels.withConverter(converter);

export class ProblemLevels {

  static async index(): Promise<ProblemLevel[]> {
    const snapshot = await problem_levels_collection.orderBy('code').get();
    const problem_levels = snapshot.docs.map((doc) => doc.data());
    return problem_levels;
  }

} 