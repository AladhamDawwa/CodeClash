import { User } from "../../../models/users";
import { GameMode } from "../../../utils/definitions/games_types";
import { IUvUMatchMakerEvaluator } from "./uvu_match_maker_evaluator";
import dotenv from 'dotenv'
dotenv.config()
const { ELO_MINIMUM_EXPECTED_OUTCOME_DIFFERENCE } = process.env

export class EloUvUMatchMakerEvaluator implements IUvUMatchMakerEvaluator {
  game_mode: GameMode
  constructor(game_mode: GameMode) {
    this.game_mode = game_mode
  }
  is_good_match(user_a: User, user_b: User): boolean {
    const user_a_mmr = (this.game_mode == GameMode.Ranked ? user_a.mmr : user_a.normal_mmr)
    const user_b_mmr = (this.game_mode == GameMode.Ranked ? user_b.mmr : user_b.normal_mmr)
    console.log(user_a_mmr, user_b_mmr)
    const user_a_expected_outcome = this.calculate_expected_outcome(
      user_a_mmr!, user_b_mmr!
    )
    const user_b_expected_outcome = 1 - user_a_expected_outcome
    const expected_difference = Math.abs(user_a_expected_outcome - user_b_expected_outcome)
    return expected_difference < parseFloat(ELO_MINIMUM_EXPECTED_OUTCOME_DIFFERENCE!)
  }

  private calculate_expected_outcome(mmr_a: number, mmr_b: number) {
    const mmr_difference = mmr_b - mmr_a
    return 1.0 / (1.0 + 10 ** (mmr_difference / 480.0))
  }
}