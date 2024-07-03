export interface IUsersMatchMakerEvaluator {
  is_good_match(user_a_mmr: number, user_b_mmr: number): boolean
}