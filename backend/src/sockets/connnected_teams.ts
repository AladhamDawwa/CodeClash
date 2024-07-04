import { Socket } from "socket.io";

export class ConnectedTeams {
  private static connected_teams: Map<string, Socket[]> = new Map<string, Socket[]>();
  private static connected_users: Map<string, Socket> = new Map<string, Socket>();
  private static current_teams: Map<string, string[]> = new Map<string, string[]>();

  static insert_user(username: string, team_name: string, socket: Socket) {
    this.connected_users.set(username, socket);
    if (this.current_teams.has(team_name)) {
      this.current_teams.get(team_name)!.push(username);
    } else {
      this.current_teams.set(team_name, [username]);
    }
    if (this.current_teams.get(team_name)!.length == 2) {
      const sockets = this.current_teams.get(team_name)!.map((username) => this.connected_users.get(username)!);
      this.connected_teams.set(team_name, sockets);
      this.current_teams.delete(team_name);
      return true;
    }
    return false;
  }

  static get_team_sockets(team_name: string): Socket[] {
    return this.connected_teams.get(team_name)!;
  }

  static remove_team(team_name: string) {
    this.connected_teams.get(team_name)!.forEach((socket) => {
      this.connected_users.delete(socket.data.username);
    })
    this.connected_teams.delete(team_name);
  }

  static get_entries() {
    return [...this.current_teams];
  }
}
