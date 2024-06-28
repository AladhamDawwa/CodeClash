import { db } from '../../firebase'
import { GameType } from '../../utils/definitions/games_types';
import { IGameUvUStore, UvUGameState } from './i_game_uvu_store';


const converter = {
  toFirestore: (data: UvUGameState) => {
    const { id, ...uvuGameStateData } = data;
    return uvuGameStateData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      game_type: data.game_type,
      game_mode: data.game_mode,
      username_a: data.username_a,
      username_b: data.username_b,
      problem_id: data.problem_id,
      duration: data.duration,
      start_time: data.start_time.toDate(),
      end_time: data.end_time.toDate(),
      submissions: data.submissions
    };
  },
};

const uvu_games_collection = db.uvu_games.withConverter(converter);

export class GameUvUFireStore implements IGameUvUStore {
  async create(game_state: UvUGameState): Promise<string> {
    const ref = await uvu_games_collection.add(game_state)
    return ref.id
  }
  async delete(game_id: string) {
    const ref = await uvu_games_collection.doc(game_id)
    await ref.delete()
  }
  async update(new_game_state: UvUGameState, game_id: string) {
    const ref = uvu_games_collection.doc(game_id)
    await ref.update(new_game_state)
  }
  async get(game_id: string): Promise<UvUGameState | null> {
    const ref = await uvu_games_collection.doc(game_id)
    const doc = await ref.get()
    if (!doc.exists) {
      return null
    }
    const game_state = doc.data()
    return game_state!
  }

  async game_exists(game_id: string): Promise<boolean> {
    const ref = await uvu_games_collection.doc(game_id)
    const doc = await ref.get()
    return doc.exists
  }
}

export default new GameUvUFireStore()