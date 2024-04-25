import express from 'express'
import dotenv from  'dotenv'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { UsersController } from './controllers/users'
import { MatchMakerSocketController } from './socket_controllers/match_maker'
import { Users, User } from './models/users'
import { MatchMakerQueueLocal } from './match_maker/queue/match_maker_queue_local'
import { EloMatchMakerEvaluator } from './match_maker/evaluator/elo_match_maker_evaluator'
dotenv.config()

const repl = require('repl')

const replServer = repl.start({
  prompt: "app > "
})

replServer.context.Users = Users 
replServer.context.MatchMakerQueueLocal = MatchMakerQueueLocal
replServer.context.EloMatchMakerEvaluator =EloMatchMakerEvaluator