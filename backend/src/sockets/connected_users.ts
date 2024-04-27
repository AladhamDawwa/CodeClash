import { Socket } from "socket.io";

export class ConnectedUsers {
  private static connected_users: Map<string, Socket> = new Map<
    string,
    Socket
  >();
  static insert_user(username: string, socket: Socket) {
    this.connected_users.set(username, socket);
  }
  static get_socket(username: string): Socket {
    return this.connected_users.get(username)!;
  }
  static remove_user(username: string) {
    this.connected_users.delete(username);
  }
  static get_entries() {
    return [...this.connected_users];
  }
}
