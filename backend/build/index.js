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
const match_maker_1 = require("./socket_controllers/match_maker");
const socket_authentication_1 = require("./middlewares/socket_authentication");
const problems_1 = require("./controllers/problems");
const teams_1 = require("./controllers/teams");
const uvu_game_1 = require("./socket_controllers/uvu_game");
const submissions_1 = require("./controllers/submissions");
const game_history_1 = require("./controllers/game_history");
const users_2 = require("./models/users");
dotenv_1.default.config();
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
// routes
users_1.UsersController.routes(app);
problems_1.ProblemsController.routes(app);
teams_1.TeamsController.routes(app);
submissions_1.SubmissionsController.routes(app);
game_history_1.GameHistoryController.routes(app);
// websockets
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    }
});
// socket.io middlewares
io.use(socket_authentication_1.authenticate_socket);
io.on('connection', (socket) => {
    new match_maker_1.MatchMakerSocketController(io, socket).register_events();
    new uvu_game_1.UvUGameSocketController(io, socket).register_events();
});
server.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});
users_2.Users.clear_status("mmr_800_1", ["in_uvu_game", "uvu_game_id"]);
