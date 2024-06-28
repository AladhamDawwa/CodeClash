import { Filter } from "firebase-admin/firestore";
import { db } from "../firebase";
import { UvUGameState } from "../game/store/i_game_uvu_store";
import { UvUGameResult, UvUUserResult } from "../services/uvu_game_service";
import { GameMode, GameType } from "../utils/definitions/games_types";
import { RankTier } from "../utils/definitions/rank_tier";

export type UvUGameHistory = {
  id?: string | number;
  game_mode?: GameMode;
  game_type?: GameType;
  problem_id?: string;
  duration?: number;
  start_time?: Date;
  end_time?: Date;
  user_a_result?: UvUUserResult,
  user_b_result?: UvUUserResult
}

const converter = {
  toFirestore: (data: UvUGameHistory) => {
    const { id, ...gameHistoryData } = data;
    return gameHistoryData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      game_mode: data.game_mode,
      game_type: data.game_type,
      problem_id: data.problem_id,
      duration: data.duration,
      start_time: data.start_time,
      end_time: data.end_time,
      user_a_result: data.user_a_result,
      user_b_result: data.user_b_result
    };
  },
};

const uvu_games_history_collection = db.uvu_games_history.withConverter(converter);

export class UvUGamesHistory {
  static async create(uvu_game_state: UvUGameState, uvu_game_result: UvUGameResult) {
    const uvu_game_history_record = this.create_uvu_game_history_record(uvu_game_state, uvu_game_result)
    const docRef = uvu_games_history_collection.doc(uvu_game_history_record.id as string)
    await docRef.set(uvu_game_history_record)
  }

  static async get(username: string) {
    const snapshot = await uvu_games_history_collection
      .where(
        Filter.or(
          Filter.where("user_a_result.username", "==", username),
          Filter.where("user_b_result.username", "==", username),
        ),
      )
      .get();
    const uvu_game_history_records = snapshot.docs.map((doc) => doc.data());
    return uvu_game_history_records
  }

  static create_uvu_game_history_record(uvu_game_state: UvUGameState, uvu_game_result: UvUGameResult): UvUGameHistory {
    return {
      id: uvu_game_state.id,
      game_mode: uvu_game_state.game_mode,
      game_type: uvu_game_state.game_type,
      problem_id: uvu_game_state.problem_id,
      duration: uvu_game_state.duration,
      start_time: uvu_game_state.start_time,
      end_time: uvu_game_state.end_time,
      user_a_result: uvu_game_result.user_a_result,
      user_b_result: uvu_game_result.user_b_result
    }
  }

} 