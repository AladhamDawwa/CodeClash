import { Timestamp } from "firebase-admin/firestore";
import { db } from "../firebase";
import { RankTier } from "../utils/definitions/rank_tier";
import dotenv from "dotenv";
dotenv.config();

export type Team = {
  doc_id?: string;
  slogan?: string;
  team_name?: string;
  emails?: string[];
  exp?: number;
  level?: number;
  rank_points?: number;
  rank_tier?: RankTier;
  registration_date?: Timestamp;
  team_image_id?: string;
  mmr?: number;
};

const converter = {
  toFirestore: (data: Team) => {
    const { doc_id, ...teamData } = data;
    return teamData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      doc_id: snap.id,
      slogan: data.slogan,
      team_name: data.team_name,
      emails: data.emails,
      exp: data.exp,
      level: data.level,
      rank_points: data.rank_points,
      rank_tier: data.rank_tier,
      registration_date: data.registration_date,
      team_image_id: data.team_image_id,
      mmr: data.mmr
    };
  },
};

const teams_collection = db.teams.withConverter(converter);

export class Teams {
  static async index(): Promise<Team[]> {
    const snapshot = await teams_collection.get();
    const teams = snapshot.docs.map((doc) => doc.data());
    return teams;
  }

  static async create(
    team_name: string,
    username: string,
    slogan: string | undefined,
  ): Promise<Team> {
    const team_creation_args = this.create_user_args(team_name, username, slogan);
    await teams_collection.add(team_creation_args);
    return team_creation_args;
  }

  static async get_by_team_name(team_name: string) {
    const snapshot = await teams_collection.where("team_name", "==", team_name).get();
    const team = snapshot.docs[0].data();
    delete team.team_name
    delete team.doc_id
    return team;
  }

  static async invite_user(team_name: string, username: string): Promise<Team> {
    const snapshot = await teams_collection
      .where("team_name", "==", team_name)
      .get();
    const team_doc = snapshot.docs[0];
    const team = team_doc.data();
    if (team.emails!.includes(username)) {
      return team;
    }
    team.emails!.push(username);
    await teams_collection.doc(team_doc.id).update({ emails: team.emails });
    return team;
  }

  //   static async get_rank(username: string): Promise<RankTier> {
  //     const snapshot = await users_collection
  //       .where("username", "==", username)
  //       .get();
  //     const user = snapshot.docs[0].data();
  //     return user.rank_tier!;
  //   }

  static async team_exists(team_name: string): Promise<boolean> {
    const snapshot = await teams_collection
      .where("team_name", "==", team_name)
      .get();
    if (snapshot.empty) {
      return false;
    }
    return true;
  }

  static async update(new_team: Team, team_name: string): Promise<Team> {
    const snapshot = await teams_collection
      .where("team_name", "==", team_name)
      .get();
    const team_doc = snapshot.docs[0];
    await teams_collection.doc(team_doc.id).update(new_team);
    return new_team;
  }

  private static create_user_args(
    team_name: string,
    username: string,
    slogan: string | undefined = undefined,
  ): Team {
    return {
      emails: [username],
      exp: 0,
      team_name: team_name,
      level: 0,
      rank_points: 0,
      rank_tier: RankTier.Bronze,
      registration_date: Timestamp.now(),
      mmr: 800,
      slogan: slogan === undefined ? "No Slogan yet!" : slogan
    };
  }
}
