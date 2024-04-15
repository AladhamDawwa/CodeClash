import express, { Request, Response } from "express";
import { Users } from "../models/users";
import { User } from "../models/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { TOKEN_SECRET } = process.env;
export class UsersController {
  static async signup(req: Request, res: Response) {
    const user: User = req.body;

    const user_exists = await Users.user_exists(user.username);
    if (user_exists) {
      res.json("username already exists");
      return;
    }
    const email_exists = await Users.email_exists(user.email);
    if (email_exists) {
      res.json("email already exists");
      return;
    }
    Users.create(
      user.first_name + "",
      user.last_name + "",
      user.email + "",
      user.username + "",
      user.password_digest + "",
    );
    const token = jwt.sign({ username: user.username }, "" + TOKEN_SECRET);
    res.json(token);
  }

  static async login(req: Request, res: Response) {}

  static routes(app: express.Application) {
    app.post("/users/signup", this.signup);
  }
}
