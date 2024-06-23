import { ProblemAndTestCases } from "../../controllers/problems"
import { Problem, Problems } from "../../models/problem"
import { TestCase, TestCases } from "../../models/test_case"
import axios from "axios"
import dotenv from 'dotenv'
dotenv.config();
const { JUDGE_ZERO_URL } = process.env

export type JudgeResult = {
  score: number,
  penalty: number,
  compile_output: string,
  message: string,
  exit_code: number,
  time: number,
  memory: number
  status: Status
}

enum Status {

  Accepted,
}


export class JudgeZeroService {

  static async submit_problem_sync(problem_id: string, source_code: string, language_id: number) {
    const testcases = await TestCases.get_inner_testcases(problem_id)
    let number_of_accepted_testcases = 0
    for (const testcase of testcases) {
      const response = await axios.request(
        this.create_submit_request_args(source_code, language_id, testcase.input!, testcase.expected_output!)
      )
      console.log(response.data)
    }
  }

  static async is_problem_testcases_valid_by_problem_id(problem: Problem, language_id: number): Promise<boolean> {
    const testcases = await TestCases.get_inner_testcases(problem.id!)
    for (const testcase of testcases) {
      try {
        const response = await axios.request(
          this.create_submit_request_args(problem.accepted_code!, language_id, testcase.input!, testcase.expected_output!)
        )
        const judge_result = response.data
        if (judge_result.status.id != 3) {
          console.log(testcase)
          return false
        }
      } catch (err) {
        console.log(err)
      }
    }
    return true
  }

  static async is_problem_testcases_valid(problem_and_testcases: ProblemAndTestCases, language_id: number): Promise<TestCase | null> {
    for (const testcase of problem_and_testcases.testcases) {
      try {
        const response = await axios.request(
          this.create_submit_request_args(problem_and_testcases.accepted_code!, language_id, testcase.input!, testcase.expected_output!)
        )
        const judge_result = response.data
        if (judge_result.status.id != 3) {
          return testcase
        }
      } catch (err) {
        console.log(err)
      }
    }
    return null
  }

  static async submit_problem_async(problem_id: string, source_code: string) {

  }

  private static create_submit_request_args(source_code: string, language_id: number, input: string, expected_output: string) {
    const args = {
      method: 'POST',
      url: `http://${JUDGE_ZERO_URL}/submissions`,
      params: {
        base64_encoded: 'true',
        wait: 'true',
        fields: 'status'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        language_id: language_id,
        source_code: source_code,
        stdin: input,
        expected_output: expected_output,
      }
    };
    return args
  }


}