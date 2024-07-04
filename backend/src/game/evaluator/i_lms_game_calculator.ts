import { User } from "../../models/users";
import { UserScoreAndPenalty, UserResult } from "../../services/uvu_game_service";
import { GameMode } from "../../utils/definitions/games_types";
import { LMSGameState } from "../store/lms/i_game_lms_store";

export interface ILMSGameCalculator {
  calculate(
    users_score_and_penalty: Map<string, UserScoreAndPenalty>,
    lms_game_state: LMSGameState,
  ): void
  calculate_eliminated_users(users_scores_and_penalty: Map<string, UserScoreAndPenalty>): string[]
}