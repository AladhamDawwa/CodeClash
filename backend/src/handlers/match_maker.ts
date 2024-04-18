import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type SocketType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
type IoType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export class MatchMakerHandler {
  public io: IoType;
  public socket: SocketType;

  constructor(io: IoType, socket: SocketType) {
    this.io = io;
    this.socket = socket;
    this.bind_methods()
  }

  async find_match(payload: Object) {
    this.socket.emit("match_maker:found_match", { message: "some_message" });
  }

  register_events() {
    this.socket.on("match_maker:find_match", this.find_match);
  }

  private bind_methods() {
    this.find_match = this.find_match.bind(this)
  }
}
