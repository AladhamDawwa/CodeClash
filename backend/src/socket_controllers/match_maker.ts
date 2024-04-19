import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { MatchMakerRequest } from "../utils/definitions/match_maker";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { MatchMakerService } from "../services/match_maker";
import { UserSocketInfo } from "../utils/definitions/user_socket_info";
type SocketType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
type IoType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

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
    const user_socket_info: UserSocketInfo = {username: match_maker_request.username, socket_id: this.socket.id}
    const match = await MatchMakerService.find_one_v_one(user_socket_info);
    console.log("Matched!:", match);
  }

  register_events() {
    this.socket.on("match_maker_server:find_match", this.find_match);
  }

  private bind_methods() {
    this.find_match = this.find_match.bind(this);
  }
}
