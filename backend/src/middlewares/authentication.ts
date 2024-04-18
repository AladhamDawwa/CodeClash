import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { TOKEN_SECRET } = process.env;

export const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    const header = req.headers.authorization!;
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, TOKEN_SECRET!) as JwtPayload;
    req.body.username = payload.username!;
  } catch (err) {
    res.status(401).json({ error: "Acess denied, invalid token" });
    return;
  }
  next();
};
