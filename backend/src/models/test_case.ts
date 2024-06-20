import { db } from "../firebase";
import { Transaction } from "firebase-admin/firestore";

enum TestCaseType {
  Sample,
  Inner
}
export type TestCase = {
  id: string
  problem_id: string
  input: string;
  expected_output: string
  test_type: TestCaseType
}
const converter = {
  toFirestore: (data: TestCase) => {
    const { id, ...testcase } = data;
    return testcase;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      problem_id: data.problem_id,
      input: data.input,
      expected_output: data.expected_output,
      test_type: data.test_type
    };
  },
};

const testcases_collection = db.testcases.withConverter(converter)

export class TestCases {
  static async create(testcase: TestCase): Promise<string> {
    const ref = await testcases_collection.add(testcase)
    return ref.id
  }
  static create_in_transaction(testcase: TestCase, transaction: Transaction): string {
    const ref = testcases_collection.doc()
    transaction.set(ref, testcase)
    return ref.id
  }
}