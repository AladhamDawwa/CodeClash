import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { TOKEN_SECRET } = process.env;

export const admin_authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    const header = req.headers.authorization!;
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, TOKEN_SECRET!) as JwtPayload;
    req.body.username = payload.username!;
    console.log(payload.username, payload.is_admin);
    if (!payload.is_admin) {
      res.status(401).json({ error: "Acess denied, You are not an admin" });
      return
    }
  } catch (err) {
    res.status(401).json({ error: "Acess denied, invalid token" });
    return;
  }
  next();
};
