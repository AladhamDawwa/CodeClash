import express from "express";
import dotenv from "dotenv";
dotenv.config();


export const get_request_authorization = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  if (req.body.username != req.params.username) {
    res.status(403).json({
      error: "You are not authorized "
    })
  } else {
    next()
  }
};
