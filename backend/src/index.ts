import express from 'express'
import dotenv from  'dotenv'
import { UsersController } from './controllers/users'

dotenv.config()

const port = process.env.PORT || 8080

const app = express()
app.use(express.json())

// routes
UsersController.routes(app)

app.listen(port, () => {
  console.log(`Listening on port : ${port}`)
})