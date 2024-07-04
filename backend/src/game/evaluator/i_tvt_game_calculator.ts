import { Team } from "../../models/teams";
import { TeamScoreAndPenalty, TvTTeamResult } from "../../services/tvt_game_service";
import { GameMode } from "../../utils/definitions/games_types";

export interface ITvTGameCalculator {
  calculate(user_a_score_and_penalty: TeamScoreAndPenalty, user_b_score_and_penalty: TeamScoreAndPenalty,
    user_a_uvu_game_result: TvTTeamResult, user_b_uvu_game_result: TvTTeamResult, game_mode: GameMode, game_duration: number, problem_rate: string, team_a: Team, team_b: Team): void;
}