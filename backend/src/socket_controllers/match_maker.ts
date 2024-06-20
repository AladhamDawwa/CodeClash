import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { MatchMakerRequest } from "../utils/definitions/match_maker";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { MatchMakerService } from "../services/match_maker_service";
import { SocketType, IoType } from "../utils/definitions/io_socket_types";
import { ConnectedUsers } from "../sockets/connected_users";

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
      this.find_one_v_one(match_maker_request);
    }
  }

  async find_one_v_one(match_maker_request: MatchMakerRequest) {
    match_maker_request.username = this.socket.data.username;
    const match_maker_response = await MatchMakerService.find_one_v_one(match_maker_request)
    console.log(match_maker_response)
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