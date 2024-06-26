import express from 'express'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { UsersController } from './controllers/users'
import { MatchMakerSocketController } from './socket_controllers/match_maker'
import { Socket } from 'dgram'
import { authenticate_socket } from './middlewares/socket_authentication'
import { ConnectedUsers } from './sockets/connected_users'
import { ProblemsController } from './controllers/problems'
import { ProblemPickerService } from './services/problem_picker_service'
import { UsersUnsolvedProblems } from './models/users_unsolved_problems'
import { TeamsController } from './controllers/teams'
import { JudgeZeroService } from './services/judge/judge_zero_service'
import { Problems } from './models/problem'
import { Console } from 'console'
import { UvUGameSocketController } from './socket_controllers/uvu_game'
import { Tiers } from './models/tiers'


dotenv.config()

const port = process.env.PORT || 8080

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// routes
UsersController.routes(app)
ProblemsController.routes(app)
TeamsController.routes(app)

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
})


server.listen(port, () => {
  console.log(`Listening on port : ${port}`)
})