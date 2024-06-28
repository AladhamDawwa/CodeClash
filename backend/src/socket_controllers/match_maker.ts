import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { MatchMakerRequest } from "../utils/definitions/match_maker";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { MatchMakerService } from "../services/match_maker_service";
import { SocketType, IoType } from "../utils/definitions/io_socket_types";
import { ConnectedUsers } from "../sockets/connected_users";
import { GameCreationService } from "../services/game_creation_service";
import { UvUGameState } from "../game/store/i_game_uvu_store";

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
    }
  }

  async find_uvu(match_maker_request: MatchMakerRequest) {
    match_maker_request.username = this.socket.data.username;
    const match_maker_response = await MatchMakerService.find_uvu(match_maker_request)
    if (match_maker_response.status == "MatchFound") {
      const uvu_game_state = await GameCreationService.create_uvu(
        this.socket.data.username, match_maker_response.user?.username!, match_maker_request.game_mode!
      )
      this.send_uvu_game_to_users(uvu_game_state)
    }
  }

  send_uvu_game_to_users(uvu_game_state: UvUGameState) {
    this.send_uvu_game_to_user(uvu_game_state.username_a!, uvu_game_state)
    this.send_uvu_game_to_user(uvu_game_state.username_b!, uvu_game_state)
  }

  send_uvu_game_to_user(username: string, uvu_game_state: UvUGameState) {
    const socket = ConnectedUsers.get_socket(username)
    socket && socket.emit("match_maker_client:found_match", uvu_game_state)

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