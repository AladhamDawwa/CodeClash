import { db } from '../../../firebase'
import { IGameTvTStore, TvTGameState } from './i_game_tvt_store';

const converter = {
  toFirestore: (data: TvTGameState) => {
    const { id, ...tvtGameStateData } = data;
    return tvtGameStateData;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      id: snap.id,
      game_type: data.game_type,
      game_mode: data.game_mode,
      team_a: data.team_a,
      team_b: data.team_b,
      problem_id: data.problem_id,
      duration: data.duration,
      start_time: data.start_time.toDate(),
      end_time: data.end_time.toDate(),
      submissions: data.submissions
    };
  },
};

const tvt_games_collection = db.tvt_games.withConverter(converter);

export class GameTvTFireStore implements IGameTvTStore {
  async create(game_state: TvTGameState): Promise<string> {
    const ref = await tvt_games_collection.add(game_state)
    return ref.id
  }

  async delete(game_id: string) {
    const ref = await tvt_games_collection.doc(game_id)
    await ref.delete()
  }

  async update(new_game_state: TvTGameState, game_id: string) {
    const ref = tvt_games_collection.doc(game_id)
    await ref.update(new_game_state)
  }

  async get(game_id: string): Promise<TvTGameState | null> {
    const ref = await tvt_games_collection.doc(game_id)
    const doc = await ref.get()
    if (!doc.exists) {
      return null
    }
    const game_state = doc.data()
    return game_state!
  }

  async game_exists(game_id: string): Promise<boolean> {
    const ref = await tvt_games_collection.doc(game_id)
    const doc = await ref.get()
    return doc.exists
  }
}

export default new GameTvTFireStore()