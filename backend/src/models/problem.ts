import { Transaction } from "firebase-admin/firestore";
import { db } from "../firebase";

export type Problem = {
  id?: string;
  title: String
  description: string;
  input_format: string;
  output_format: string
  memory_limit: number;
  time_limit: number;
  rating?: string;
  tags?: string[];
  accepted_code?: string;
}

const converter = {
  toFirestore: (data: Problem) => {
    const { id, ...problem } = data;
    return problem;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      title: data.title,
      description: data.description,
      input_format: data.input_format,
      output_format: data.output_format,
      memory_limit: data.memory_limit,
      time_limit: data.time_limit,
      rating: data.rating,
      tags: data.tags,
      accepted_code: data.accepted_code
    };
  },
};

const problems_collection = db.problems.withConverter(converter)

export class Problems {

  static async create(problem: Problem): Promise<string> {
    const ref = await problems_collection.add(problem)
    return ref.id
  }

  static async get_problem(problem_id: string): Promise<Problem> {
    const docRef = problems_collection.doc(problem_id);
    const docSnapshot = await docRef.get();
    const problem = docSnapshot.data()
    return problem!
  }

  static create_in_transaction(problem: Problem, transaction: Transaction): string {
    const ref = problems_collection.doc()
    transaction.set(ref, problem)
    return ref.id
  }

  static async problem_exists_in_transaction(problem: Problem, transaction: Transaction): Promise<boolean> {
    const problemQuery = problems_collection.where('title', '==', problem.title);
    const querySnapshot = await transaction.get(problemQuery);

    if (!querySnapshot.empty) {
      return true
    }
    return false
  }

  static async get_all_problems() {
    const snapshot = await problems_collection.get();
    const problems = snapshot.docs.map((doc) => doc.data());
    return problems;
  }

}