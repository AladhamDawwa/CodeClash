import { GameState } from "../game/store/uvu/i_game_uvu_store";
import { Submission } from "../models/submissions";
import { SubmissionStatus } from "../services/judge/judge_zero_service";
import { TvTGameResult, TvTGameService, TvTTeamResult } from "../services/tvt_game_service";
import { ConnectedTeams } from "../sockets/connnected_teams";
import { IoType, SocketType } from "../utils/definitions/io_socket_types";
import { GameSubmissionRequest } from "./uvu_game";

export class TvTGameSocketController {
  public io: IoType;
  public socket: SocketType;

  constructor(io: IoType, socket: SocketType) {
    this.io = io;
    this.socket = socket;
    this.bind_methods();
  }

  async submit_problem(data: string, callback: (response: Submission) => void) {
    const tvt_game_submission_request: GameSubmissionRequest = JSON.parse(data)
    tvt_game_submission_request.submission_time = new Date()
    const game = await TvTGameService.get_game(tvt_game_submission_request.game_id)
    if (game == null) return

    const submission_time_valid = TvTGameService.is_submission_time_valid(tvt_game_submission_request, game)

    if (!submission_time_valid) return

    this.send_submission_notification_to_opponent(game);
    const team = ConnectedTeams.get_team(this.socket.data.username);
    const submission = await TvTGameService.submit_problem(
      game, team, tvt_game_submission_request
    )
    callback(submission)
    if (submission.status == SubmissionStatus.Accepted) {
      TvTGameService.end_game(game)
    }
  }

  async get_game(game_id: string, callback: (response: { status: string, game: (GameState | null) }) => void) {
    const game = await TvTGameService.get_game(game_id)
    if (game == null) {
      callback({ status: "Game has ended", game: null })
      return
    }
    callback({ status: "Game Found", game: game })
  }

  static send_game_result_to_teams(game_result: TvTGameResult) {
    this.send_game_result_to_team(game_result.team_a_result)
    this.send_game_result_to_team(game_result.team_b_result)
  }

  static send_game_result_to_team(team_result: TvTTeamResult) {
    delete team_result.new_mmr
    ConnectedTeams.get_team_sockets(team_result.team_name!).forEach(socket => {
      socket.emit("tvt_game_client:send_game_result", team_result)
    })
  }

  send_submission_notification_to_opponent(game: GameState) {
    const team = ConnectedTeams.get_team(this.socket.data.username);
    if (game.username_a == team) {
      this.send_submission_notification(game.username_b!)
    } else {
      this.send_submission_notification(game.username_a!)
    }
  }

  send_submission_notification(team_name: string) {
    ConnectedTeams.get_team_sockets(team_name).forEach(socket => {
      socket.emit("tvt_game_client:submission_notification", "Opponent submitted")
    })
  }

  register_events() {
    this.socket.on("tvt_game_server:submit_problem", this.submit_problem);
    this.socket.on("tvt_game_server:get_game", this.get_game)
    this.socket.on("disconnect", () => {
      ConnectedTeams.remove_team(this.socket.id);
    });
  }

  private bind_methods() {
    this.submit_problem = this.submit_problem.bind(this);
    this.get_game = this.get_game.bind(this)
  }
}