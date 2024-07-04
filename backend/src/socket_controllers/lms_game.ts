import { LMSGameState } from "../game/store/lms/i_game_lms_store";
import { Submission } from "../models/submissions";
import { LMSGameService } from "../services/lms_game_service";
import { UserResult } from "../services/uvu_game_service";
import { ConnectedUsers } from "../sockets/connected_users";
import { IoType, SocketType } from "../utils/definitions/io_socket_types";

export type LMSGameSubmissionRequest = {
  source_code: string,
  game_id: string,
  language_id: number,
  submission_time?: Date,
  round?: number
}

export class LMSGameSocketController {
  public io: IoType;
  public socket: SocketType;

  constructor(io: IoType, socket: SocketType) {
    this.io = io;
    this.socket = socket;
    this.bind_methods();
  }

  async submit_problem(data: string, callback: (response: Submission) => void) {
    const lms_submission_request: LMSGameSubmissionRequest = JSON.parse(data)
    lms_submission_request.submission_time = new Date()
    const game = await LMSGameService.get_game(lms_submission_request.game_id)
    if (game == null) {
      return
    }
    if (!this.is_user_belongs_to_game(game)) {
      return
    }
    const submission_time_valid = LMSGameService.is_submision_time_valid(lms_submission_request, game)
    if (!submission_time_valid) {
      return
    }

    this.send_submision_notification_to_opponent(game)
    const submission = await LMSGameService.submit_problem(
      game, this.socket.data.username, lms_submission_request
    )
    callback(submission)
  }

  static send_game_result_to_user(user_result: UserResult) {
    const socket = ConnectedUsers.get_socket(user_result.username!)
    delete user_result.new_mmr
    socket && socket.emit("lms_game_client:send_game_result", user_result)
  }

  static send_new_round_to_users(lms_game_state: LMSGameState) {
    for (const username of lms_game_state.usernames) {
      const socket = ConnectedUsers.get_socket(username)
      socket && socket.emit("lms_game_client:new_round", lms_game_state)
    }
  }

  is_user_belongs_to_game(game: LMSGameState): boolean {
    return game.usernames.includes(this.socket.data.username)
  }


  // static send_game_result_to_users(game_result: UvUGameResult) {
  //   this.send_game_result_to_user(game_result.user_a_result)
  //   this.send_game_result_to_user(game_result.user_b_result)
  // }

  // static send_game_result_to_user(user_result: UserResult) {
  //   const socket = ConnectedUsers.get_socket(user_result.username!)
  //   delete user_result.new_mmr
  //   socket && socket.emit("lms_game_client:send_game_result", user_result)
  // }

  send_submision_notification_to_opponent(game: LMSGameState) {
    for (const username of game.usernames) {
      if (username != this.socket.data.username) {
        this.send_submission_notification(username)
      }
    }
  }

  send_submission_notification(username: string) {
    const socket = ConnectedUsers.get_socket(username)
    socket && socket.emit("lms_game_client:submission_notification", `${this.socket.data.username} Submitted`)
  }

  register_events() {
    this.socket.on("lms_game_server:submit_problem", this.submit_problem);
    this.socket.on("disconnect", () => {
      ConnectedUsers.remove_user(this.socket.data.username);
    });
  }

  private bind_methods() {
    this.submit_problem = this.submit_problem.bind(this);
  }
}