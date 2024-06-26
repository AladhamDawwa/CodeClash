import { User } from "../../models/users";
import { UserScoreAndPenalty, UvUUserResult } from "../../services/uvu_game_service";

export interface IUvUGameCalculator {
  calculate_users_rank(user_a_score_and_penalty: UserScoreAndPenalty, user_b_score_and_penalty: UserScoreAndPenalty,
    user_a_uvu_game_result: UvUUserResult, user_b_uvu_game_result: UvUUserResult, user_a: User, user_b: User): void;
}