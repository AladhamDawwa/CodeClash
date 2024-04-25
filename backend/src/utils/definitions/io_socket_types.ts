import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server, Socket } from "socket.io";

export type SocketType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
export type IoType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;