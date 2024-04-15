import { Timestamp } from "firebase-admin/firestore";
import { db } from "../firebase";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const { SALT_ROUNDS, PEPPER } = process.env;

export type User = {
  doc_id?: string;
  description?: string;
  email?: string;
  exp?: number;
  first_name?: string;
  image?: string;
  last_name?: string;
  level?: number;
  password_digest?: string;
  rank_points?: number;
  rank_tier?: number;
  registeration_date?: Timestamp;
  username?: string;
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
      password_digest: data.password_digest,
      rank_points: data.rank_points,
      rank_tier: data.rank_tier,
      registeration_date: data.registeration_date,
      username: data.username,
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
  ): Promise<string> {
    const salt_rounds = "" + SALT_ROUNDS;
    const password_digest = bcrypt.hashSync(
      password + PEPPER,
      parseInt(salt_rounds),
    );
    const ref = await users_collection.add(
      this.create_user_args(
        first_name,
        last_name,
        email,
        username,
        password_digest,
      ),
    );
    return ref.id;
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

  private static create_user_args(
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password_digest: string,
  ): User {
    return {
      email: email,
      exp: 0,
      first_name: first_name,
      last_name: last_name,
      level: 0,
      password_digest: password_digest,
      rank_points: 0,
      rank_tier: 0,
      registeration_date: Timestamp.now(),
      username: username,
    };
  }
}
