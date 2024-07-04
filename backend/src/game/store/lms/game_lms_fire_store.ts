import { db } from '../../../firebase'
import { UserResult } from '../../../services/uvu_game_service';
import { IGameLMSStore, LMSGameState } from './i_game_lms_store';


const converter = {
  toFirestore: (data: LMSGameState) => {
    const { id, current_users_results, ...lmsGameStateData } = data;
    const current_users_results_obj = Object.fromEntries(current_users_results!)
    return {
      ...lmsGameStateData,
      current_users_results: current_users_results_obj
    };
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    const current_users_results_map = new Map<string, UserResult>(Object.entries(data.current_users_results));
    return {
      id: snap.id,
      game_type: data.game_type,
      game_mode: data.game_mode,
      usernames: data.usernames,
      problem_id: data.problem_id,
      duration: data.duration,
      start_time: data.start_time.toDate(),
      end_time: data.end_time.toDate(),
      round: data.round,
      current_users_results: current_users_results_map
    };
  },
};

const lms_games_collection = db.lms_games.withConverter(converter);

export class GameLMSFireStore implements IGameLMSStore {
  async create(game_state: LMSGameState): Promise<string> {
    const ref = await lms_games_collection.add(game_state)
    return ref.id
  }
  async delete(game_id: string) {
    const ref = await lms_games_collection.doc(game_id)
    await ref.delete()
  }
  async update(new_game_state: LMSGameState, game_id: string) {
    const ref = lms_games_collection.doc(game_id)
    const current_users_results_map = new_game_state.current_users_results;
    delete new_game_state.current_users_results
    await ref.update({ ...new_game_state, current_users_results: Object.fromEntries(current_users_results_map!) })
    new_game_state.current_users_results = current_users_results_map
  }
  async get(game_id: string): Promise<LMSGameState | null> {
    const ref = await lms_games_collection.doc(game_id)
    const doc = await ref.get()
    if (!doc.exists) {
      return null
    }
    const game_state = doc.data()
    return game_state!
  }

  async game_exists(game_id: string): Promise<boolean> {
    const ref = await lms_games_collection.doc(game_id)
    const doc = await ref.get()
    return doc.exists
  }
}

export default new GameLMSFireStore()