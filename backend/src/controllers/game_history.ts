import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { authenticate } from "../middlewares/authentication";
import { UvUGameHistory, UvUGamesHistory } from "../models/uvu_game_history";
import { get_request_authorization } from "../middlewares/get_request_authorization";
dotenv.config();


export class GameHistoryController {
  static async get_games_by_username(req: Request, res: Response) {
    const games: (UvUGameHistory)[] = []
    const username = req.params.username
    const uvu_games = await UvUGamesHistory.get(username)
    games.push(...uvu_games)
    res.json(games)
  }

  static routes(app: express.Application) {
    app.get("/game_history/:username", [authenticate, get_request_authorization], this.get_games_by_username)

  }
}