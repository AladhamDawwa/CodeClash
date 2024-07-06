import express from 'express'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { UsersController } from './controllers/users'
import { MatchMakerSocketController } from './socket_controllers/match_maker'
import { Users, User } from './models/users'
import { UvUMatchMakerQueueLocal } from './match_maker/queue/uvu/uvu_match_maker_queue_local'
import { EloUsersMatchMakerEvaluator } from './match_maker/evaluator/users/elo_users_match_maker_evaluator'
dotenv.config()

const repl = require('repl')

const replServer = repl.start({
  prompt: "app > "
})

replServer.context.Users = Users
replServer.context.MatchMakerQueueLocal = UvUMatchMakerQueueLocal
replServer.context.EloMatchMakerEvaluator = EloUsersMatchMakerEvaluator