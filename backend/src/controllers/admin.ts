import express, { Request, Response } from "express";
import { Users } from "../models/users";
import { User } from "../models/users";
import jwt from "jsonwebtoken";
import { authenticate } from "../middlewares/authentication";
import dotenv from "dotenv";

import { Admins } from "../models/admin";

dotenv.config();
const { TOKEN_SECRET } = process.env;
export class AdminController {
  static async login(req: Request, res: Response) {
    const admin = await Admins.login(req.body.username, req.body.password);
    if (!admin) {
      return res
        .status(401)
        .json({ error: "admin username or passowrd is incorrect" });
    }
    const token = jwt.sign({ username: admin.username, is_admin: true }, TOKEN_SECRET!);
    res.json({ user: admin, token: token, is_admin: true });
  }

  static routes(app: express.Application) {
    app.post("/admin/login", this.login)
  }
}