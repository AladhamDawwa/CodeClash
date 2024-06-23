import express, { Request, Response } from "express";
import { Problems, Problem } from "../models/problem"
import { TestCases, TestCase } from "../models/test_case";
import { firestore } from '../firebase'
import dotenv from "dotenv";
import { UsersUnsolvedProblems } from "../models/users_unsolved_problems";
import { JudgeZeroService } from "../services/judge/judge_zero_service";
dotenv.config();

export type ProblemAndTestCases = {
  memory_limit: number;
  title: string,
  time_limit: number,
  tags: string[],
  rating: string,
  testcases: TestCase[]
  description: string
  input_format: string
  output_format: string
  accepted_code?: string
}
export class ProblemsController {
  static async create_problems(req: Request, res: Response) {
    const problems_and_testcases: ProblemAndTestCases[] = req.body
    for (const problem_and_testcases of problems_and_testcases) {
      let problem_skipped = false
      let problem_id = "";
      let wrong_testcase
      if (problem_and_testcases.accepted_code == undefined) {
        wrong_testcase = null
      }
      else {
        wrong_testcase = await JudgeZeroService.is_problem_testcases_valid(problem_and_testcases, 52)
      }
      if (wrong_testcase != null) {
        console.log(`Problem with title "${problem_and_testcases.title}" doesn't have valid testcases`);
        console.log(wrong_testcase)
      }
      else {
        try {
          await firestore.runTransaction(async (transaction) => {
            const problem_exists = await Problems.problem_exists_in_transaction(
              ProblemsController.create_problem_args(problem_and_testcases),
              transaction
            )
            if (problem_exists) {
              console.log(`Problem with title "${problem_and_testcases.title}" already exists.`);
              problem_skipped = true
              return
            }
            problem_id = Problems.create_in_transaction(
              ProblemsController.create_problem_args(problem_and_testcases),
              transaction
            )
            for (const testcase of problem_and_testcases.testcases) {
              testcase.problem_id = problem_id
              TestCases.create_in_transaction(testcase, transaction)
            }
          })
          if (!problem_skipped) {
            console.log(`write successful for problem: ${problem_and_testcases.title}`);
            UsersUnsolvedProblems.insert_problem_for_all(problem_id, problem_and_testcases.rating, problem_and_testcases.title)
          }

        }
        catch (err) {
          console.log(`write Failed for problem: ${problem_and_testcases.title} - ${err}`);
        }
      }
    }


    res.status(200).json("finished writing the problems")
  }

  static async get_problem(req: Request, res: Response) {
    const problem_id = req.params.problem_id
    const problem = await Problems.get_problem(problem_id)
    const test_cases = await TestCases.get_sample_testcases(problem_id)

    ProblemsController.remove_problem_protected_fields(problem)
    ProblemsController.remove_testcases_protected_fields(test_cases)

    res.json({
      problem,
      test_cases
    })
  }

  static remove_problem_protected_fields(problem: Problem) {
    delete problem.id
    delete problem.accepted_code
    delete problem.rating
    delete problem.tags
  }

  static remove_testcase_protected_fields(test_case: TestCase) {
    delete test_case.id
    delete test_case.test_type
  }

  static remove_testcases_protected_fields(test_cases: TestCase[]) {
    for (const test_case of test_cases) {
      ProblemsController.remove_testcase_protected_fields(test_case)
    }
  }
  private static create_problem_args(problem_and_testcases: ProblemAndTestCases): Problem {
    const { testcases, ...problem } = problem_and_testcases
    return problem
  }

  static routes(app: express.Application) {
    app.post('/problems/create', this.create_problems)
    app.get('/problems/:problem_id', this.get_problem)
  }
}