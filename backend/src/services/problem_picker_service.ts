import { Problem, Problems } from "../models/problem";
import { ProblemLevel, ProblemLevels } from "../models/problem_levels";
import { User } from "../models/users";
import { UserUnsolvedProblems, UsersUnsolvedProblems } from "../models/users_unsolved_problems";

export class ProblemPickerService {

  static async pick_problem(users: User[]): Promise<Problem | null> {
    const average_mmr = this.calculate_average_mmr(users)
    const problem_level_code = await this.get_problem_level_code(average_mmr)
    const problem = await this.pick_problem_by_code(users, problem_level_code)
    return problem
  }

  static async pick_problem_by_code(users: User[], problem_level_code: string): Promise<Problem | null> {
    const users_unsolved_problems = await UsersUnsolvedProblems.get_problems_array_by_code(users, problem_level_code)
    const problem_ids_countmap: { [key: string]: number } = {};
    let chosen_problem_id: string = ""
    for (const problem_id of users_unsolved_problems) {
      problem_ids_countmap[problem_id] = (problem_ids_countmap[problem_id] || 0) + 1;
      if (problem_ids_countmap[problem_id] == users.length) {
        chosen_problem_id = problem_id
        break
      }
    }
    if (chosen_problem_id == "") {
      console.log("No common unsolved problems !!")
      return null
    }
    const problem = await Problems.get_problem(chosen_problem_id)
    return problem
  }

  static calculate_average_mmr(users: User[]): number {
    let average_mmr = 0.0
    for (const user of users) {
      average_mmr += user.mmr!
    }
    average_mmr /= users.length
    return average_mmr
  }

  static async get_problem_level_code(mmr: number): Promise<string> {
    let chosen_problem_code: string = "a"
    const problem_levels = await ProblemLevels.index()
    for (const problem_level of problem_levels) {
      if (problem_level.max_mmr != -1) {
        if (mmr >= problem_level.min_mmr && mmr <= problem_level.max_mmr) {
          chosen_problem_code = problem_level.code
          break
        }
      }
      else {
        if (mmr >= problem_level.min_mmr) {
          chosen_problem_code = problem_level.code
          break
        }
      }
    }
    return chosen_problem_code
  }
}