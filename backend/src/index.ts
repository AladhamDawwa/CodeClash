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
import { JudgeZeroService } from './services/judge/judge_zero_service'
import { Problems } from './models/problem'
import { Console } from 'console'


dotenv.config()

const port = process.env.PORT || 8080

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// routes
UsersController.routes(app)
ProblemsController.routes(app)

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
})


server.listen(port, () => {
  console.log(`Listening on port : ${port}`)
})

// const test = async () => {
//   let number_of_problems_tested = 0
//   let number_of_valid_problems = 0
//   const problems = await Problems.get_all_problems()
//   const invalid_problems: string[] = []
//   for (const problem of problems) {
//     if (problem.accepted_code != undefined) {
//       console.log(`testing problem: ${problem.title} - ${problem.id}`)
//       const is_problem_valid = await JudgeZeroService.is_problem_testcases_valid_by_problem_id(problem, 52)
//       number_of_problems_tested += 1
//       if (is_problem_valid) {
//         console.log(`problem: ${problem.title} - ${problem.id} is correct`)
//         number_of_valid_problems += 1
//       } else {
//         console.log(`problem: ${problem.title} - ${problem.id} is not valid !!!!!`)
//         invalid_problems.push(`${problem.title} - ${problem.id}`)

//       }
//     }
//   }
//   console.log(`${number_of_valid_problems} valid problems of ${number_of_problems_tested} problems tested`)

//   console.log("******** FAILED PROBLEMS *****")
//   console.log(invalid_problems)
// }
// test()