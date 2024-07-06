import { Filter, Timestamp } from "firebase-admin/firestore";
import { db } from "../firebase";
import bcrypt from "bcrypt";
import { RankTier } from "../utils/definitions/rank_tier";
import dotenv from "dotenv";
import { UsersUnsolvedProblems } from "./users_unsolved_problems";
import { firestore } from "firebase-admin";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { UserResult } from "../services/uvu_game_service";
dotenv.config();

const { SALT_ROUNDS, PEPPER, LEVEL_K } = process.env;

export type UserStatus = {
  in_game: boolean,
  game_id: string;
  game_type: GameType,
  game_mode: GameMode
}
export type UserLevel = {
  level: number,
  xp: number,
  xp_for_next_level: number
}

export type User = {
  doc_id?: string;
  description?: string;
  email?: string;
  first_name?: string;
  image?: string;
  last_name?: string;
  password?: string;
  rank_points?: number;
  rank_tier?: RankTier;
  registeration_date?: Timestamp;
  username?: string;
  mmr?: number;
  normal_mmr?: number
  profile_image_id?: string;
  status?: UserStatus,
  user_level?: UserLevel

};

const converter = {
  toFirestore: (data: User) => {
    const { doc_id, ...userData } = data;
    return userData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      doc_id: snap.id,
      description: data.description,
      email: data.email,
      exp: data.exp,
      first_name: data.first_name,
      image: data.image,
      last_name: data.last_name,
      level: data.level,
      password: data.password,
      rank_points: data.rank_points,
      rank_tier: data.rank_tier,
      registeration_date: data.registeration_date,
      username: data.username,
      mmr: data.mmr,
      normal_mmr: data.normal_mmr,
      profile_image_id: data.profile_image_id,
      user_level: data.user_level
    };
  },
};

const users_collection = db.users.withConverter(converter);

export class Users {
  static async index(): Promise<User[]> {
    const snapshot = await users_collection.get();
    const users = snapshot.docs.map((doc) => doc.data());
    return users;
  }

  static async create(
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const salt_rounds = SALT_ROUNDS!;
    password = bcrypt.hashSync(password + PEPPER, parseInt(salt_rounds));
    const user_creation_args = this.create_user_args(
      first_name,
      last_name,
      email,
      username,
      password,
    );
    await users_collection.add(
      this.create_user_args(first_name, last_name, email, username, password),
    );
    UsersUnsolvedProblems.init(username)
    delete user_creation_args.password;
    return user_creation_args;
  }

  static async get_by_username(username: string) {
    const snapshot = await users_collection
      .where("username", "==", username)
      .get();
    const user = snapshot.docs[0].data();
    delete user.password
    delete user.doc_id
    return user;
  }

  static async get_by_usernames(usernames: string[]) {
    const snapshot = await users_collection
      .where("username", "in", usernames)
      .get();
    const users = snapshot.docs.map((doc) => doc.data());
    return users
  }

  static async clear_status(username: string, keys_to_remove: string[]) {
    const snapshot = await users_collection
      .where("username", "==", username)
      .get();
    const docRef = snapshot.docs[0].ref
    const toBeRemovedData: { [key: string]: any } = {}
    keys_to_remove.forEach(key => {
      toBeRemovedData[`status.${key}`] = firestore.FieldValue.delete()
    })

    await docRef.update(toBeRemovedData)
  }

  static async admin_clear_fields(usernames: (string | undefined)[], keys_to_remove: string[]) {
    const snapshot = await users_collection
      .where("username", "in", usernames)
      .get();
    const docRef = snapshot.docs[0].ref
    const toBeRemovedData: { [key: string]: any } = {}
    keys_to_remove.forEach(key => {
      toBeRemovedData[`${key}`] = firestore.FieldValue.delete()
    })

    await docRef.update(toBeRemovedData)
  }

  static async admin_clear_status_for_all_users() {
    const users = await this.index()
    let usernames = users
      .filter(user => user.username !== undefined)
      .map(user => user.username);
    for (const username of usernames) {
      await this.admin_clear_fields([username], ["status"])
    }
    console.log("Finished clearing")
  }

  static async get_rank(username: string): Promise<RankTier> {
    const snapshot = await users_collection
      .where("username", "==", username)
      .get();
    const user = snapshot.docs[0].data();
    return user.rank_tier!;
  }

  static async user_exists(username: string | undefined): Promise<boolean> {
    const snapshot = await users_collection
      .where("username", "==", username)
      .get();
    if (snapshot.empty) {
      return false;
    }
    return true;
  }

  static async email_exists(email: string | undefined): Promise<boolean> {
    const snapshot = await users_collection.where("email", "==", email).get();
    if (snapshot.empty) {
      return false;
    }
    return true;
  }

  static async login(
    username_or_email: string,
    password: string,
  ): Promise<User | null> {
    const snapshot = await users_collection
      .where(
        Filter.or(
          Filter.where("username", "==", username_or_email),
          Filter.where("email", "==", username_or_email),
        ),
      )
      .get();

    if (!snapshot.empty) {
      const user = snapshot.docs[0].data();
      if (bcrypt.compareSync(password + PEPPER, user.password!)) {
        delete user.password;
        return user;
      }
    }

    return null;
  }

  static async update(new_user: User, username: string): Promise<User> {
    if ("password" in new_user) {
      const salt_rounds = SALT_ROUNDS!;
      new_user.password = bcrypt.hashSync(
        new_user.password! + PEPPER,
        parseInt(salt_rounds),
      );
    }
    const snapshot = await users_collection
      .where("username", "==", username)
      .get();
    const user_doc = snapshot.docs[0];
    await users_collection.doc(user_doc.id).update(new_user);
    return { ...user_doc, ...new_user };
  }



  static async update_user_level_and_xp(user_level: UserLevel, username: string) {
    await Users.update({ user_level: user_level }, username)
  }

  static async update_users_rank_and_mmr(user_result: UserResult, username: string) {
    await Users.update({
      mmr: user_result.new_mmr,
      rank_points: user_result.new_points,
      rank_tier: user_result.new_tier
    }, username)
  }

  private static create_user_args(
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
  ): User {
    return {
      email: email,
      first_name: first_name,
      last_name: last_name,
      password: password,
      rank_points: 0,
      rank_tier: RankTier.Bronze,
      registeration_date: Timestamp.now(),
      username: username,
      mmr: 800,
      normal_mmr: 800,
      description: "Hey There ! I am using codeclash",
      user_level: { level: 0, xp: 0, xp_for_next_level: Math.pow((1 / parseFloat(LEVEL_K!)), 2) },
    };
  }
}
