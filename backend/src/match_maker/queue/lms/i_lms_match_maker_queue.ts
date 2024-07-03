import { User } from '../../../models/users'

export interface ILMSMatchMakerQueue {
  push(new_user: User): void;
  find_best(): User[];
  remove(users: User[]): void;
  get_all(): User[];
}