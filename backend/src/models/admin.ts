import dotenv from 'dotenv'
import bcrypt from "bcrypt";
dotenv.config();
import { db } from "../firebase";

const { SALT_ROUNDS, PEPPER, LEVEL_K } = process.env;

export type Admin = {
  id?: string;
  username?: string;
  password?: string;
}
const converter = {
  toFirestore: (data: Admin) => {
    const { id, ...adminData } = data;
    return adminData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    const admin: Admin = {
      id: snap.id,
      username: data.username,
      password: data.password
    }
    return admin;
  },
};
const admins_collection = db.admins.withConverter(converter)

export class Admins {
  static async login(
    username: string,
    password: string,
  ): Promise<Admin | null> {
    const snapshot = await admins_collection
      .where("username", "==", username)
      .get();

    if (!snapshot.empty) {
      const admin = snapshot.docs[0].data();
      if (bcrypt.compareSync(password + PEPPER, admin.password!)) {
        delete admin.password;
        return admin;
      }
    }
    return null;
  }

  static async create(username: string, password: string) {
    if (await this.admin_exists(username)) {
      return "Admin Already exists"
    }
    const salt_rounds = SALT_ROUNDS!;
    password = bcrypt.hashSync(password + PEPPER, parseInt(salt_rounds));
    const admin: Admin = {
      username: username,
      password: password
    }
    await admins_collection.add(
      admin
    );
    delete admin.password;
    return admin
  }

  static async admin_exists(username: string | undefined): Promise<boolean> {
    const snapshot = await admins_collection
      .where("username", "==", username)
      .get();
    if (snapshot.empty) {
      return false;
    }
    return true;
  }

}