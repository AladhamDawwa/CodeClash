import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { authenticate } from "../middlewares/authentication";
import { Submissions } from "../models/submissions";
import { get_request_authorization } from "../middlewares/get_request_authorization";
dotenv.config();


export class SubmissionsController {
  static async get_submisions_by_game_id_and_username(req: Request, res: Response) {
    const username = req.params.username
    const game_id = req.params.game_id
    const submissions = await Submissions.get_by_game_id_and_username(game_id, username)
    res.json(submissions)
  }

  static async get_submission_by_id(req: Request, res: Response) {
    const submission_id = req.params.submission_id
    const submission = await Submissions.get_by_id(submission_id)
    res.json(submission)
  }


  static routes(app: express.Application) {
    app.get("/submissions/:game_id/:username", [authenticate, get_request_authorization], this.get_submisions_by_game_id_and_username)
    app.get("/submissions/:submission_id", this.get_submission_by_id)

  }
}