import jwt, { JwtPayload } from "jsonwebtoken";
import { SocketType } from "../utils/definitions/io_socket_types";
import dotenv from "dotenv";
import { ExtendedError } from "socket.io/dist/namespace";
import { ConnectedUsers } from "../sockets/connected_users";
dotenv.config();

const { TOKEN_SECRET } = process.env;

export const authenticate_socket = (
  socket: SocketType,
  next: (err?: ExtendedError) => void,
) => {
  try {
    const token = socket.handshake.headers.token as string;
    const payload = jwt.verify(token, TOKEN_SECRET!) as JwtPayload;
    const username: string = payload.username;
    socket.data.username = username;
    ConnectedUsers.insert_user(socket.data.username, socket);

  } catch (err) {
    return next(new Error("Authentication error: invalid token"));
  }
  next();
};
