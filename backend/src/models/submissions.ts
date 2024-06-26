import { db } from "../firebase";
import { JudgeResult } from "../services/judge/judge_zero_service";

export type Submission = JudgeResult & {
  id?: string;
  game_id?: string | number,
  source_code?: string,
  language_id?: number,
  username?: string
}

const converter = {
  toFirestore: (data: Submission) => {
    const { id, ...submissionData } = data;
    return submissionData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      game_id: data.game_id,
      compile_output: data.compile_output,
      message: data.message,
      exit_code: data.exit_code,
      exit_signal: data.exit_signal,
      time: data.time,
      memory: data.memory,
      status: data.status,
      number_of_accepted_testcases: data.number_of_accepted_testcases,
      total_number_of_testcases: data.total_number_of_testcases,
      submission_time: data.submission_time.toDate(),
      score: data.score,
      source_code: data.source_code,
      language_id: data.language_id,
      username: data.username
    };
  },
};

const submissions_collection = db.submissions.withConverter(converter);

export class Submissions {

  static async index(): Promise<Submission[]> {
    const snapshot = await submissions_collection.get();
    const submissions = snapshot.docs.map((doc) => doc.data());
    return submissions;
  }

  static async create(judge_result: JudgeResult, game_id: string | number, source_code: string, language_id: number, username: string): Promise<Submission> {
    const submission: Submission = {
      ...judge_result,
      game_id: game_id,
      source_code: source_code,
      language_id: language_id,
      username: username
    }
    const ref = await submissions_collection.add(submission)
    submission.id = ref.id
    return submission
  }

  static async get_submissions_by_game_id(game_id: string | number): Promise<Submission[]> {
    const snapshot = await submissions_collection
      .where("game_id", "==", game_id)
      .select(
        "score",
        "submission_time",
        "username",
        "status"
      ).
      orderBy("submission_time")
      .get();
    const data = snapshot.docs.map(doc => doc.data());
    const submissions: Submission[] = []
    for (const submission of data) {
      submissions.push({
        username: submission["username"],
        score: submission["score"],
        submission_time: submission["submission_time"],
        status: submission["status"]
      })
    }
    return submissions
  }

  static async get_by_id(submission_id: string) {
    const ref = await submissions_collection.doc(submission_id)
    const doc = await ref.get()
    const submission = doc.data()
    return submission!
  }

} 