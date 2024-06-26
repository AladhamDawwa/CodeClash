import { ProblemAndTestCases, ProblemsController } from "../../controllers/problems"
import { Problem, Problems } from "../../models/problem"
import { TestCase, TestCases } from "../../models/test_case"
import axios from "axios"
import dotenv from 'dotenv'
dotenv.config();

const { JUDGE_ZERO_URL, NUMBER_OF_JUDGE_RUNS } = process.env

export type JudgeResult = {
  compile_output?: string,
  message?: string,
  exit_code?: number,
  exit_signal?: number
  time?: number,
  memory?: number,
  status?: SubmissionStatus,
  number_of_accepted_testcases?: number,
  total_number_of_testcases?: number,
  submission_time?: Date
  score?: number
}

export enum SubmissionStatus {
  InQueue = 1,
  Processing = 2,
  Accepted = 3,
  WrongAnswer = 4,
  TimeLimitExceeded = 5,
  CompilationError = 6,
  RuntimeErrorSIGSEGV = 7,
  RuntimeErrorSIGXFSZ = 8,
  RuntimeErrorSIGFPE = 9,
  RuntimeErrorSIGABRT = 10,
  RuntimeErrorNZEC = 11,
  RuntimeErrorOTHER = 12,
  InternalError = 13,
  ExecFormatError = 14

}


export class JudgeZeroService {
  static MAX_SCORE = 100
  static async submit_problem_sync(problem_id: string, source_code: string, language_id: number, submission_time: Date = new Date()): Promise<JudgeResult> {
    const testcases = await TestCases.get_inner_testcases(problem_id)
    const problem = await Problems.get_problem(problem_id)
    const judge_result = this.create_judge_result_obj(testcases.length, submission_time)
    for (const testcase of testcases) {
      const response = await axios.request(
        this.create_submit_request_args(source_code, language_id, problem, testcase)
      )
      const submission_result = response.data
      this.update_judge_result(judge_result, submission_result)
      if (judge_result.status != SubmissionStatus.Accepted) {
        break
      }
    }
    judge_result.score = (judge_result.number_of_accepted_testcases! / judge_result.total_number_of_testcases!) * JudgeZeroService.MAX_SCORE
    return judge_result
  }

  static update_judge_result(judge_result: JudgeResult, submission_result: any) {
    judge_result.time = Math.max(submission_result.time, judge_result.time!)
    judge_result.memory = Math.max(submission_result.memory, judge_result.memory!)
    judge_result.compile_output = submission_result.compile_output
    judge_result.exit_code = submission_result.exit_code
    judge_result.exit_signal = submission_result.exit_signal
    judge_result.status = submission_result.status.id
    judge_result.message = submission_result.message
    if (judge_result.status == SubmissionStatus.Accepted) {
      judge_result.number_of_accepted_testcases!++;
    }
  }



  static async is_problem_testcases_valid_by_problem_id(problem: Problem, language_id: number): Promise<boolean> {
    const testcases = await TestCases.get_inner_testcases(problem.id!)
    for (const testcase of testcases) {
      try {
        const response = await axios.request(
          this.create_submit_request_args(problem.accepted_code!, language_id, problem, testcase)
        )
        const judge_result = response.data
        console.log(judge_result)

        if (judge_result.status.id != SubmissionStatus.Accepted) {
          console.log(testcase)
          return false
        }
      } catch (err) {
        console.log(err)
      }
    }
    return true
  }

  static create_judge_result_obj(number_of_testcases: number, submission_time: Date): JudgeResult {
    return {
      compile_output: "",
      message: "",
      exit_code: 0,
      exit_signal: 0,
      time: 0,
      memory: 0,
      status: SubmissionStatus.WrongAnswer,
      total_number_of_testcases: number_of_testcases,
      number_of_accepted_testcases: 0,
      submission_time: submission_time,
      score: 0
    }
  }
  static async is_problem_testcases_valid(problem_and_testcases: ProblemAndTestCases, language_id: number): Promise<TestCase | null> {
    const problem = ProblemsController.create_problem_args(problem_and_testcases)
    for (const testcase of problem_and_testcases.testcases) {
      try {
        const response = await axios.request(
          this.create_submit_request_args(problem_and_testcases.accepted_code!, language_id,
            problem
            , testcase)
        )
        const judge_result = response.data
        if (judge_result.status.id != 3) {
          console.log(judge_result)
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

  private static create_submit_request_args(source_code: string, language_id: number, problem: Problem, test_case: TestCase) {
    const args = {
      method: 'POST',
      url: `http://${JUDGE_ZERO_URL}/submissions`,
      params: {
        base64_encoded: 'true',
        wait: 'true',
        fields: 'status,compile_output,message,exit_code,exit_signal,time,memory'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        language_id: language_id,
        source_code: source_code,
        stdin: test_case.input,
        expected_output: test_case.expected_output,
        cpu_time_limit: problem.time_limit,
        memory_limit: problem.memory_limit * 1000,
        number_of_runs: this.get_number_of_judge_runs()
      }
    };
    return args
  }

  private static get_number_of_judge_runs() {
    let number_of_judge_runs = 1
    try {
      number_of_judge_runs = parseInt(NUMBER_OF_JUDGE_RUNS!)
    } catch (err) {

    }
    return number_of_judge_runs
  }

}