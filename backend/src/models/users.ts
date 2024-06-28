import { Filter, Timestamp } from "firebase-admin/firestore";
import { db } from "../firebase";
import bcrypt from "bcrypt";
import { RankTier } from "../utils/definitions/rank_tier";
import dotenv from "dotenv";
import { UsersUnsolvedProblems } from "./users_unsolved_problems";
import { firestore } from "firebase-admin";
dotenv.config();

const { SALT_ROUNDS, PEPPER } = process.env;

export type UserStatus = {
  in_uvu_game?: boolean
  uvu_game_id?: string
}
export type User = {
  doc_id?: string;
  description?: string;
  email?: string;
  exp?: number;
  first_name?: string;
  image?: string;
  last_name?: string;
  level?: number;
  password?: string;
  rank_points?: number;
  rank_tier?: RankTier;
  registeration_date?: Timestamp;
  username?: string;
  mmr?: number;
  profile_image_id?: string;
  status?: UserStatus
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
      profile_image_id: data.profile_image_id
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
    const ref = await users_collection.add(
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

  private static create_user_args(
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
  ): User {
    return {
      email: email,
      exp: 0,
      first_name: first_name,
      last_name: last_name,
      level: 0,
      password: password,
      rank_points: 0,
      rank_tier: RankTier.Bronze,
      registeration_date: Timestamp.now(),
      username: username,
      mmr: 800,
      description: "Hey There ! I am using codeclash"
    };
  }
}
