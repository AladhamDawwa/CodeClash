import express, { Request, Response } from "express";
import { Team, Teams } from "../models/teams";

// import jwt from "jsonwebtoken";
import { authenticate } from "../middlewares/authentication";
import { log } from "console";
import { Users } from "../models/users";
// import dotenv from "dotenv";
// import multer from 'multer';
// import imagekit from "../imagekit";

// dotenv.config();

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const { TOKEN_SECRET } = process.env;
export class TeamsController {
  static async create(req: Request, res: Response) {
    let team: Team = req.body;

    const team_exists = await Teams.team_exists(team.team_name!);
    if (team_exists) {
      res.status(400).json({ error: "team name already exists" });
      return;
    }

    team = await Teams.create(team.team_name!, req.body.username, team.slogan);
    res.json(team);
  }

  static async invite_user(req: Request, res: Response) {
    const team_name = req.body.team_name;
    const username = req.body.user;
    const team = await Teams.invite_user(team_name, username);
    res.json(team);
  }

  static async update(req: Request, res: Response) {
    delete req.body.username;
    const team = await Teams.update(req.body, req.params.team_name);
    res.json(team);
  }

  static async get_by_team_name(req: Request, res: Response) {
    const team_name = req.params.team_name
    const team = await Teams.get_by_team_name(team_name)
    res.json(team)
  }

  static async get_teams(req: Request, res: Response) {
    const teams = (await Teams.index()).filter((team) => {
      return team.emails && team.emails.includes(req.body.username)
    })
    res.json(teams)
  }

  // static async upload_profile_picture(req: Request, res: Response) {
  //   if (!req.file) {
  //     return res.status(400).send("No file uploaded")
  //   }

  //   const result = await imagekit.upload({
  //     file: req.file.buffer,
  //     fileName: req.file.originalname
  //   })
  //   const user = await Users.get_by_username(req.body.username)
  //   if (user.profile_image_id != undefined) {
  //     UsersController.delete_image(user.profile_image_id)
  //   }
  //   await Users.update({ image: result.url, profile_image_id: result.fileId }, req.body.username)
  //   return res.json("Image uploaded")
  // }

  // static async delete_image(image_id: string) {
  //   try {
  //     const fileDetails = await imagekit.getFileDetails(image_id);
  //     if (!fileDetails) {
  //       return
  //     }
  //     const fileId = fileDetails.fileId
  //     await imagekit.deleteFile(fileId);
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  static routes(app: express.Application) {
    app.post("/teams/create", authenticate, this.create);
    app.get("/teams/all", authenticate, this.get_teams);
    app.get("/teams/:team_name", authenticate, this.get_by_team_name);
    app.put("/teams/:team_name", authenticate, this.update);
    app.post("/teams/invite", authenticate, this.invite_user);
    // app.put("/users/profile_picture", [upload.single('image'), authenticate], this.upload_profile_picture)
  }
}
