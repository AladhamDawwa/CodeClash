import { User } from "../../../models/users";
export interface IUvUMatchMakerQueue {
  is_empty(): boolean;
  find_best(user: User): (User | null)
  push(user: User): void
  remove(user: User): void
  get_all_data(): User[]
}