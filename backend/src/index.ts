import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { GameHistoryController } from './controllers/game_history'
import { ProblemsController } from './controllers/problems'
import { SubmissionsController } from './controllers/submissions'
import { TeamsController } from './controllers/teams'
import { UsersController } from './controllers/users'
import { authenticate_socket } from './middlewares/socket_authentication'
import { MatchMakerSocketController } from './socket_controllers/match_maker'
import { UvUGameSocketController } from './socket_controllers/uvu_game'
import { LMSGameSocketController } from './socket_controllers/lms_game'
import { TvTGameSocketController } from './socket_controllers/tvt_game'
import { UsersUnsolvedProblems } from './models/users_unsolved_problems'
import { NotificationsController } from './controllers/notifications'
import { AdminController } from './controllers/admin'

dotenv.config()

const port = process.env.PORT || 8080

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// routes
UsersController.routes(app)
ProblemsController.routes(app)
TeamsController.routes(app)
SubmissionsController.routes(app)
GameHistoryController.routes(app)
NotificationsController.routes(app)
AdminController.routes(app)
// websockets
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  }
})

// socket.io middlewares
io.use(authenticate_socket)

io.on('connection', (socket) => {
  new MatchMakerSocketController(io, socket).register_events()
  new UvUGameSocketController(io, socket).register_events()
  new LMSGameSocketController(io, socket).register_events()
  new TvTGameSocketController(io, socket).register_events()
})

UsersUnsolvedProblems.init('Aladham2001');
UsersUnsolvedProblems.init('mmr_800_1');
UsersUnsolvedProblems.init('mmr_850_1');
UsersUnsolvedProblems.init('hossam22');
// Users.admin_clear_status_for_all_users()
server.listen(port, () => {
  console.log(`Listening on port : ${port}`)
})

// const create_admin = async () => {
//   const admin = await Admins.create("shehabgad", "password123")
//   console.log(admin)
// }
// create_admin()