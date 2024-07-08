import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebase_config = require("./config/firebase").firebase
initializeApp({
  credential: cert(firebase_config)
})

// firestore
export const firestore = getFirestore()
export const db = {
  users: firestore.collection("users"),
  uvu_games: firestore.collection("uvu_games"),
  tvt_games: firestore.collection("tvt_games"),
  problems: firestore.collection("problems"),
  testcases: firestore.collection("testcases"),
  users_unsolved_problems: firestore.collection("users_unsolved_problems"),
  tiers: firestore.collection("tiers"),
  problem_levels: firestore.collection("problem_levels"),
  submissions: firestore.collection("submissions"),
  teams: firestore.collection("teams"),
  uvu_games_history: firestore.collection("uvu_games_history"),
  lms_games: firestore.collection("lms_games"),
  notifications: firestore.collection("notifications"),
  users_notifications: firestore.collection("users_notifications"),
  admins: firestore.collection("admins"),
}


