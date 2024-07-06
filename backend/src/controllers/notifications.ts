import { Notifications, systemNotification } from "../models/notifications";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Teams } from "../models/teams";
import { authenticate } from "../middlewares/authentication";
dotenv.config();

export class NotificationsController {
  static async get_user_notifications(req: Request, res: Response) {
    const username = req.body.username
    const user_notifications = await Notifications.get_user_notifications(username)
    res.send(user_notifications)
  }

  static async create_notification(req: Request, res: Response) {
    const notification: systemNotification = req.body
    const doc_id = await Notifications.create(notification)
    res.send(doc_id)
  }

  static async delete_notification(req: Request, res: Response) {
    const doc_id = req.params.doc_id
    await Notifications.delete(doc_id)
    res.send("notification deleted")
  }

  static async accept_notification(req: Request, res: Response) {
    const notificationId = req.body.notificationId
    const notification = await Notifications.get(notificationId!)
    Teams.add_user_to_team(notification!.message, notification!.to)
    await Notifications.delete(notificationId!)
    res.send("notification accepted")
  }

  static routes(app: express.Application) {
    app.get("/notifications", authenticate, this.get_user_notifications)
    app.post("/notifications", authenticate, this.create_notification)
    app.post("/notifications/accept", authenticate, this.accept_notification)
    app.delete("/notifications/:doc_id", authenticate, this.delete_notification)
  }
}
