import { User } from '../../../models/users'
import { IUsersMatchMakerEvaluator } from '../../evaluator/users/i_users_match_maker_evaluator'
import { EloUsersMatchMakerEvaluator } from '../../evaluator/users/elo_users_match_maker_evaluator'
import dotenv from 'dotenv'
import { GameMode } from '../../../utils/definitions/games_types'
import { ILMSMatchMakerQueue } from './i_lms_match_maker_queue'
const { LMS_MX_USERS } = process.env

export class LMSMatchMakerQueueLocal implements ILMSMatchMakerQueue {
  users: User[] = []
  private matchMakerEvaluator: IUsersMatchMakerEvaluator = new EloUsersMatchMakerEvaluator(GameMode.Ranked)

  push(new_user: User) {
    const index = this.users.findIndex(user => user.mmr! < new_user.mmr!)
    if (index == -1) {
      this.users.push(new_user)
    } else {
      this.users.splice(index, 0, new_user)
    }
  }

  find_best(): User[] {
    for (let i = 0; i < this.users.length; i++) {
      let j = i + parseInt(LMS_MX_USERS!) - 1
      if (j >= this.users.length) {
        break
      }
      if (this.matchMakerEvaluator.is_good_match(this.users[i].mmr!, this.users[j].mmr!)) {
        const group = this.users.slice(i, i + parseInt(LMS_MX_USERS!));
        this.remove(group)
        return group
      }
    }
    return []
  }

  remove(users: User[]) {
    const usernames = users.map(user => user.username!)
    this.users = this.users.filter(user => !usernames.includes(user.username!))
  }

  get_all() {
    return this.users
  }
}