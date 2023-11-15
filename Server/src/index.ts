import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

let room : number | undefined;
let id = 0;

const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("join", () => {
    if (room === undefined) {
      socket.join(`${id}`);
      room = id++;
    } else {
      socket.join(`${room}`);
      io.in(`${room}`).emit("joined", `You are in room #${room}`);
      console.log(`You are in room #${room}`);
      room = undefined;
    }
  });

  socket.on("message", (msg) => {
    io.in(`${room}`).emit("message", msg);
  });
});

httpServer.listen(3000, () => {
  console.log("listening on 3000");
});
