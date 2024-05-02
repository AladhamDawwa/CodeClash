import express from 'express'
import dotenv from  'dotenv'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { UsersController } from './controllers/users'
import { MatchMakerSocketController } from './socket_controllers/match_maker'
import { Socket } from 'dgram'
import { authenticate_socket } from './middlewares/socket_authentication'
import { ConnectedUsers } from './sockets/connected_users'
dotenv.config()

const port = process.env.PORT || 8080

const app = express()
app.use(cors())
app.use(express.json())

// routes
UsersController.routes(app)


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
  new MatchMakerSocketController(io,socket).register_events()

})


server.listen(port, () => {
  console.log(`Listening on port : ${port}`)
})