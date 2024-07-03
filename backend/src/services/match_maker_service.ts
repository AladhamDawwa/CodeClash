import { IUvUMatchMakerQueue } from "../match_maker/queue/uvu/i_uvu_match_maker_queue";
import { UvUNormalMatchMakerQueueLocal } from "../match_maker/queue/uvu/uvu_normal_match_maker_queue_local";
import { UvURankedMatchMakerQueueLocal } from "../match_maker/queue/uvu/uvu_ranked_match_maker_queue_local";
import { User, Users } from "../models/users";
import { GameMode } from "../utils/definitions/games_types";
import { LMSMatchMakerResponse, MatchMakerRequest, MatchMakerResponse } from "../utils/definitions/match_maker";
import { ILMSMatchMakerQueue } from '../match_maker/queue/lms/i_lms_match_maker_queue'
import { LMSMatchMakerQueueLocal } from '../match_maker/queue/lms/lms_match_maker_queue_local'

export class MatchMakerService {
  static uvu_ranked_match_maker_queue: IUvUMatchMakerQueue = new UvURankedMatchMakerQueueLocal();
  static uvu_normal_match_maker_queue: IUvUMatchMakerQueue = new UvUNormalMatchMakerQueueLocal();
  static lms_match_maker_queue: ILMSMatchMakerQueue = new LMSMatchMakerQueueLocal()
  static async find_uvu(match_maker_request: MatchMakerRequest): Promise<MatchMakerResponse> {
    const user = await Users.get_by_username(match_maker_request.username!);
    const target_match_maker_queue = (match_maker_request.game_mode == GameMode.Normal ? this.uvu_normal_match_maker_queue : this.uvu_ranked_match_maker_queue)
    console.log(target_match_maker_queue.get_all_data())
    const matched_user = target_match_maker_queue.find_best(user);

    if (matched_user) {
      const match_maker_response: MatchMakerResponse = {
        status: "MatchFound",
        user: matched_user
      }
      return match_maker_response;
    }
    target_match_maker_queue.push(user);
    return {
      status: "InQueue"
    };
  }
  static async find_lms(match_maker_request: MatchMakerRequest): Promise<LMSMatchMakerResponse> {
    const user = await Users.get_by_username(match_maker_request.username!);
    this.lms_match_maker_queue.push(user)
    const group = this.lms_match_maker_queue.find_best()
    if (group.length == 0) {
      const match_maker_response: LMSMatchMakerResponse = {
        status: "InQueue"
      }
      return match_maker_response
    }
    else {
      const match_maker_response: LMSMatchMakerResponse = {
        status: "MatchFound",
        users: group
      }
      return match_maker_response
    }
  }
  static async handle_disconnection(username: string) {
    const user = await Users.get_by_username(username)
    this.uvu_ranked_match_maker_queue.remove(user)
    this.uvu_normal_match_maker_queue.remove(user)
  }
}
