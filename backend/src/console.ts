import express from 'express'
import dotenv from  'dotenv'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { UsersController } from './controllers/users'
import { MatchMakerSocketController } from './socket_controllers/match_maker'
import { Users } from './models/users'
dotenv.config()

const repl = require('repl')

const replServer = repl.start({
  prompt: "app > "
})

replServer.context.Users = Users 
