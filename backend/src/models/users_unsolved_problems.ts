import { Problem, Problems } from "./problem";
import dotenv from "dotenv";
import { db } from "../firebase";
import { User, Users } from "./users";
import { firestore } from "firebase-admin";
import { Filter } from "firebase-admin/firestore";
import * as firestore_admin from 'firebase-admin'
dotenv.config();
export type UserUnsolvedProblems = {
  id?: string;
  username?: string
  rating_a?: string[]
  rating_b?: string[]
  rating_c?: string[]
  rating_d?: string[]
  rating_e?: string[]
  rating_f?: string[]
  rating_g?: string[]
  rating_h?: string[]
  rating_i?: string[]
  rating_j?: string[]
}

const converter = {
  toFirestore: (data: UserUnsolvedProblems) => {
    const { id, ...userUnsolvedProblemsData } = data;
    return userUnsolvedProblemsData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      username: data.username,
      rating_a: data.rating_a,
      rating_b: data.rating_b,
      rating_c: data.rating_c,
      rating_d: data.rating_d,
      rating_e: data.rating_e,
      rating_f: data.rating_f,
      rating_g: data.rating_g,
      rating_h: data.rating_h,
      rating_i: data.rating_i,
      rating_j: data.rating_j
    };
  },
};
const users_unsolved_problems_collection = db.users_unsolved_problems.withConverter(converter)

export class UsersUnsolvedProblems {
  static async init(username: string) {
    const record_exists = await this.record_for_user_exists(username)
    if (record_exists) {
      return;
    }
    const problems = await Problems.get_all_problems()
    const user_unsolved_problems = this.create_user_unsolved_problems_object(username)
    for (const problem of problems) {
      this.append_problem_in_object(user_unsolved_problems, problem.id, problem.rating!)
    }
    const ref = await users_unsolved_problems_collection.add(user_unsolved_problems)
  }

  static append_problem_in_object(user_unsolved_problems: UserUnsolvedProblems, problem_id: (string | undefined), problem_rate: string) {
    if (!problem_id) {
      return
    }
    switch (problem_rate) {
      case 'a':
        user_unsolved_problems.rating_a?.push(problem_id)
        break
      case 'b':
        user_unsolved_problems.rating_b?.push(problem_id)
        break
      case 'c':
        user_unsolved_problems.rating_c?.push(problem_id)
        break
      case 'd':
        user_unsolved_problems.rating_d?.push(problem_id)
        break
      case 'e':
        user_unsolved_problems.rating_e?.push(problem_id)
        break
      case 'f':
        user_unsolved_problems.rating_f?.push(problem_id)
        break
      case 'g':
        user_unsolved_problems.rating_g?.push(problem_id)
        break
      case 'h':
        user_unsolved_problems.rating_h?.push(problem_id)
        break
      case 'i':
        user_unsolved_problems.rating_i?.push(problem_id)
        break
      case 'j':
        user_unsolved_problems.rating_j?.push(problem_id)
        break
    }
  }
  static create_user_unsolved_problems_object(username: string): UserUnsolvedProblems {
    return {
      username: username,
      rating_a: [],
      rating_b: [],
      rating_c: [],
      rating_d: [],
      rating_e: [],
      rating_f: [],
      rating_g: [],
      rating_h: [],
      rating_i: [],
      rating_j: []
    }
  }
  static async insert_problem_for_all(problem_id: string, problem_rate: string, problem_title: string) {
    const snapshot = await users_unsolved_problems_collection.get()
    const batch = firestore().batch();
    snapshot.forEach(doc => {
      const docRef = doc.ref
      switch (problem_rate) {
        case 'a':
          batch.update(docRef, {
            rating_a: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'b':
          batch.update(docRef, {
            rating_b: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'c':
          batch.update(docRef, {
            rating_c: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'd':
          batch.update(docRef, {
            rating_d: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'e':
          batch.update(docRef, {
            rating_e: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'f':
          batch.update(docRef, {
            rating_f: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'g':
          batch.update(docRef, {
            rating_g: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'h':
          batch.update(docRef, {
            rating_h: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'i':
          batch.update(docRef, {
            rating_i: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
        case 'j':
          batch.update(docRef, {
            rating_j: firestore.FieldValue.arrayUnion(problem_id)
          })
          break
      }
    })

    await batch.commit()
    console.log(`Problem ${problem_title} added to users`)
  }

  static async remove_problem(username: string, problem_id: string, problem_rate: string) {
    const snapshot = await users_unsolved_problems_collection.where("username", "==", username).get()
    snapshot.forEach(async (doc) => {
      const docRef = doc.ref
      const updateData: {
        [key: string]: firestore_admin.firestore.FieldValue
      } = {};
      updateData[`rating_${problem_rate}`] = firestore_admin.firestore.FieldValue.arrayRemove(problem_id);
      await docRef.update(updateData)
    });
  }

  static async record_for_user_exists(username: string): Promise<boolean> {
    const snapshot = await users_unsolved_problems_collection.where("username", "==", username).get();
    if (snapshot.empty) {
      return false;
    }
    return true;
  }

  static async get_problems_array_by_code(users: User[], problem_level_code: string): Promise<string[]> {
    const usernames: string[] = []
    for (const user of users) {
      usernames.push(user.username!)
    }
    const snapshot = await users_unsolved_problems_collection
      .where("username", "in", usernames)
      .select(`rating_${problem_level_code}`)
      .get();
    const data = snapshot.docs.map(doc => doc.data());

    const problem_ids: string[] = []
    for (const user_unsolved_problems of data) {
      problem_ids.push(...user_unsolved_problems[`rating_${problem_level_code}`])
    }
    return problem_ids
  }

  static async admin_create_for_all() {
    const users = await Users.index()
    for (const user of users) {
      this.init(user.username!)
    }
  }

}