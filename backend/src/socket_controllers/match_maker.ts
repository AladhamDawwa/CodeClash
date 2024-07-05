import { MatchMakerRequest, TeamMatchMakerRequest } from "../utils/definitions/match_maker";
import { GameType } from "../utils/definitions/games_types";
import { MatchMakerService } from "../services/match_maker_service";
import { SocketType, IoType } from "../utils/definitions/io_socket_types";
import { ConnectedUsers } from "../sockets/connected_users";
import { GameCreationService } from "../services/game_creation_service";
import { GameState } from "../game/store/uvu/i_game_uvu_store";
import { Teams } from "../models/teams";
import { LMSGameState } from "../game/store/lms/i_game_lms_store";
import { ConnectedTeams } from "../sockets/connnected_teams";

export class MatchMakerSocketController {
  public io: IoType;
  public socket: SocketType;

  constructor(io: IoType, socket: SocketType) {
    this.io = io;
    this.socket = socket;
    this.bind_methods();
  }

  async find_match(data: string) {
    const match_maker_request: MatchMakerRequest = JSON.parse(data);
    if (match_maker_request.game_type == GameType.OneVsOne) {
      this.find_uvu(match_maker_request);
    } else if (match_maker_request.game_type == GameType.TeamVsTeam) {
      this.tvt_setup(data);
    } else if (match_maker_request.game_type == GameType.LastManStanding) {
      this.find_lms(match_maker_request)
    }
  }

  async find_uvu(match_maker_request: MatchMakerRequest) {
    match_maker_request.username = this.socket.data.username;
    const match_maker_response = await MatchMakerService.find_uvu(match_maker_request)
    console.log(match_maker_response)
    if (match_maker_response.status == "MatchFound") {
      const uvu_game_state = await GameCreationService.create_uvu(
        this.socket.data.username, match_maker_response.user!.username!, match_maker_request.game_mode!
      );
      this.send_uvu_game_to_users(uvu_game_state)
    }
  }

  async find_lms(match_maker_request: MatchMakerRequest) {
    match_maker_request.username = this.socket.data.username
    const match_maker_response = await MatchMakerService.find_lms(match_maker_request)
    if (match_maker_response.status == "MatchFound") {
      const lms_game_state = await GameCreationService.create_lms(
        match_maker_response.users!,
        match_maker_request.game_mode!
      )
      this.send_lms_game_to_users(lms_game_state)
    }
  }

  async tvt_setup(data: string) {
    const team_match_maker_request: TeamMatchMakerRequest = JSON.parse(data);
    const team = await Teams.get_by_team_name(team_match_maker_request.team_name);
    if (!team) {
      this.socket.emit("match_maker_client:team_not_found", "Team not found");
      return;
    }
    // if (team.members.length < 3) {
    //   this.socket.emit("match_maker_client:team_not_found", "Team must have at least 3 members");
    //   return;
    // }
    const team_completed = ConnectedTeams.insert_user(
      this.socket.data.username, team_match_maker_request.team_name, this.socket
    );
    if (team_completed) {
      this.socket.emit("match_maker_client:team_completed", team);
      this.find_tvt(team_match_maker_request);
    }
  }

  async find_tvt(match_maker_request: TeamMatchMakerRequest) {
    const match_maker_response = await MatchMakerService.find_tvt(match_maker_request)
    if (match_maker_response.status == "MatchFound") {
      const tvt_game_state = await GameCreationService.create_tvt(
        match_maker_request.team_name!, match_maker_response.team!.team_name, match_maker_request.game_mode!
      )
      this.send_tvt_game_to_users(match_maker_response.team!.team_name, tvt_game_state)
      this.send_tvt_game_to_users(match_maker_request.team_name!, tvt_game_state)
    }
  }

  send_uvu_game_to_users(uvu_game_state: GameState) {
    this.send_uvu_game_to_user(uvu_game_state.username_a!, uvu_game_state)
    this.send_uvu_game_to_user(uvu_game_state.username_b!, uvu_game_state)
  }

  send_lms_game_to_users(lms_game_state: LMSGameState) {
    for (const username of lms_game_state.usernames) {
      this.send_lms_game_to_user(username, lms_game_state)
    }
  }

  async send_tvt_game_to_users(team_name: string, tvt_game_state: GameState) {
    ConnectedTeams.get_team_sockets(team_name).forEach((socket) => {
      socket.emit("match_maker_client:found_match", tvt_game_state)
    })
  }

  send_uvu_game_to_user(username: string, uvu_game_state: GameState) {
    const socket = ConnectedUsers.get_socket(username)
    socket && socket.emit("match_maker_client:found_match", uvu_game_state)
  }

  send_lms_game_to_user(username: string, lms_game_state: LMSGameState) {
    const socket = ConnectedUsers.get_socket(username)
    socket && socket.emit("match_maker_client:found_match", lms_game_state)
  }

  register_events() {
    this.socket.on("match_maker_server:find_match", this.find_match);
    this.socket.on("disconnect", () => {
      MatchMakerService.handle_disconnection(this.socket.data.username)
      ConnectedUsers.remove_user(this.socket.data.username);
    });
  }

  private bind_methods() {
    this.find_match = this.find_match.bind(this);
  }
}