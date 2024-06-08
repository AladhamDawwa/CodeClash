import express, { Request, Response } from "express";
import { Problems, Problem } from "../models/problem"
import { TestCases, TestCase } from "../models/test_case";
import { firestore } from '../firebase'
import dotenv from "dotenv";
dotenv.config();

type ProblemAndTestCases = {
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
          const problem_id = Problems.create_in_transaction(
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
        }

      }
      catch (err) {
        console.log(`write Failed for problem: ${problem_and_testcases.title} - ${err}`);
      }

    }


    res.status(200).json("finished writing the problems")
  }

  private static create_problem_args(problem_and_testcases: ProblemAndTestCases): Problem {
    const { testcases, ...problem } = problem_and_testcases
    return problem
  }

  static routes(app: express.Application) {
    app.post('/problems/create', this.create_problems)
  }
}