"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const users_1 = require("./controllers/users");
const match_maker_1 = require("./handlers/match_maker");
dotenv_1.default.config();
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// routes
users_1.UsersController.routes(app);
// websockets
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    new match_maker_1.MatchMakerHandler(io, socket).register_events();
});
server.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});
