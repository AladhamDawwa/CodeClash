import { db } from "../firebase";

export type ProblemLevel = {
  id: string;
  code: string;
  min_mmr: number;
  max_mmr: number;
  duration: number
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
      max_mmr: data.max_mmr,
      duration: data.duration
    };
  },
};

const problem_levels_collection = db.problem_levels.withConverter(converter);

export class ProblemLevels {
  static problem_levels: ProblemLevel[] = []

  static async index(): Promise<ProblemLevel[]> {
    if (!this.problem_levels.length) {
      const snapshot = await problem_levels_collection.orderBy('code').get();
      const problem_levels = snapshot.docs.map((doc) => doc.data());
      this.problem_levels = problem_levels
    }
    return this.problem_levels
  }
  static async get_uvu_game_duration(problem_rating: string): Promise<number> {
    if (!this.problem_levels.length) {
      await this.index()
    }

    let duration = 60
    for (const problem_level of this.problem_levels) {
      if (problem_level.code == problem_rating) {
        duration = problem_level.duration
        break
      }
    }
    return duration

  }



} 