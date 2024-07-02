import { User } from "../../../models/users";

export interface IUvUMatchMakerEvaluator {
  is_good_match(user_a: User, user_b: User): boolean
}