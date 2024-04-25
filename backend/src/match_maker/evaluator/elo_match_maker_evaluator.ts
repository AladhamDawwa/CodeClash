import { User } from "../../models/users";
import { IMatchMakerEvaluator } from "./match_maker_evaluator";
import dotenv from 'dotenv'
dotenv.config()
const { ELO_MINIMUM_EXPECTED_OUTCOME_DIFFERENCE } = process.env

export class EloMatchMakerEvaluator implements IMatchMakerEvaluator {
    is_good_match(user_a: User, user_b: User): boolean {
      const user_a_expected_outcome = this.calculate_expected_outcome(user_a.mmr!,user_b.mmr!)
      const user_b_expected_outcome = 1 - user_a_expected_outcome
      const expected_difference = Math.abs(user_a_expected_outcome - user_b_expected_outcome)
      return expected_difference < parseFloat(ELO_MINIMUM_EXPECTED_OUTCOME_DIFFERENCE!)
    }

    private calculate_expected_outcome(mmr_a: number, mmr_b: number) {
      const mmr_difference = mmr_b - mmr_a
      return 1.0 / (1.0 + 10**(mmr_difference / 480.0))
    }
}