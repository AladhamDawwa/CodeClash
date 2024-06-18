import express, { Request, Response } from "express";
import { Users } from "../models/users";
import { User } from "../models/users";
import jwt from "jsonwebtoken";
import { authenticate } from "../middlewares/authentication";
import dotenv from "dotenv";
dotenv.config();

const { TOKEN_SECRET } = process.env;
export class UsersController {
  static async signup(req: Request, res: Response) {
    let user: User = req.body;

    const user_exists = await Users.user_exists(user.username);
    if (user_exists) {
      res.status(400).json({ error: "username already exists" });
      return;
    }
    const email_exists = await Users.email_exists(user.email);
    if (email_exists) {
      res.status(400).json({ error: "email already exists" });
      return;
    }

    user = await Users.create(
      user.first_name!,
      user.last_name!,
      user.email!,
      user.username!,
      user.password!,
    );

    const token = jwt.sign({ username: user.username }, TOKEN_SECRET!);
    res.json({ user: user, token: token });
  }

  static async login(req: Request, res: Response) {
    let username_or_email: string;
    if ("email" in req.body) {
      username_or_email = req.body.email;
    } else {
      username_or_email = req.body.username;
    }
    const user = await Users.login(username_or_email, req.body.password);
    if (!user) {
      return res
        .status(401)
        .json({ error: "username/email or passowrd is incorrect" });
    }
    const token = jwt.sign({ username: user.username }, TOKEN_SECRET!);
    res.json({ user: user, token: token });
  }

  static async update(req: Request, res: Response) {
    let new_user: User = req.body.new_user;

    let username = req.body.username;
    new_user = await Users.update(new_user, username);

    res.json({ user: new_user });
  }

  static async get_by_username(req: Request, res: Response) {
    const username = req.params.username
    const user = await Users.get_by_username(username)
    res.json(user)
  }

  static routes(app: express.Application) {
    app.post("/users/signup", this.signup);
    app.post("/users/login", this.login);
    app.put("/users", authenticate, this.update);
    app.get("/users/:username", authenticate, this.get_by_username)
  }
}
