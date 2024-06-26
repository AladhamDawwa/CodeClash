import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { MatchMakerRequest } from "../utils/definitions/match_maker";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { MatchMakerService } from "../services/match_maker_service";
import { SocketType, IoType } from "../utils/definitions/io_socket_types";
import { ConnectedUsers } from "../sockets/connected_users";
import gameUvUStore from "../game/store/game_uvu_fire_store";
import { UvUGameState } from "../game/store/i_game_uvu_store";
import { JudgeResult, JudgeZeroService, SubmissionStatus } from "../services/judge/judge_zero_service";
import { UvUGameResult, UvUGameService, UvUUserResult } from "../services/uvu_game_service";
import { Submission } from "../models/submissions";

export type UvUGameSubmissionRequest = {
  source_code: string,
  game_id: string,
  language_id: number,
  submission_time?: Date
}

export class UvUGameSocketController {
  public io: IoType;
  public socket: SocketType;

  constructor(io: IoType, socket: SocketType) {
    this.io = io;
    this.socket = socket;
    this.bind_methods();
  }

  async submit_problem(data: string, callback: (response: Submission) => void) {
    const uvu_game_submission_request: UvUGameSubmissionRequest = JSON.parse(data)
    uvu_game_submission_request.submission_time = new Date()
    const game = await UvUGameService.get_game(uvu_game_submission_request.game_id)
    if (game == null) {
      return
    }
    if (!this.is_user_belongs_to_game(game)) {
      return
    }
    const submission_time_valid = UvUGameService.is_submision_time_valid(uvu_game_submission_request, game)
    if (!submission_time_valid) {
      return
    }

    this.send_submision_notification_to_opponent(game)
    const submission = await UvUGameService.submit_problem(
      game, this.socket.data.username, uvu_game_submission_request
    )
    callback(submission)
    if (submission.status == SubmissionStatus.Accepted) {
      UvUGameService.end_game(game)
    }
  }

  is_user_belongs_to_game(game: UvUGameState): boolean {
    if (this.socket.data.username == game.username_a || this.socket.data.username == game.username_b) {
      return true
    }
    return false
  }


  static send_game_result_to_users(game_result: UvUGameResult) {
    this.send_game_result_to_user(game_result.user_a_result)
    this.send_game_result_to_user(game_result.user_b_result)
  }

  static send_game_result_to_user(user_result: UvUUserResult) {
    const socket = ConnectedUsers.get_socket(user_result.username!)
    delete user_result.new_mmr
    socket && socket.emit("uvu_game_client:send_game_result", user_result)
  }

  send_submision_notification_to_opponent(game: UvUGameState) {
    if (game.username_a == this.socket.data.username) {
      this.send_submission_notification(game.username_b!)
    } else {
      this.send_submission_notification(game.username_a!)
    }
  }

  send_submission_notification(username: string) {
    const socket = ConnectedUsers.get_socket(username)
    socket && socket.emit("uvu_game_client:submission_notification", "Opponent submitted")
  }

  register_events() {
    this.socket.on("uvu_game_server:submit_problem", this.submit_problem);
    this.socket.on("disconnect", () => {
      ConnectedUsers.remove_user(this.socket.data.username);
    });
  }

  private bind_methods() {
    this.submit_problem = this.submit_problem.bind(this);
  }
}