import {
  TopScorer,
  TopScorerDAO,
} from '../../application/protocols/TopScorerDAO';
import { db } from '../../shared/config';

export class MongoTopScorerDAO implements TopScorerDAO {
  async getTopScorers(): Promise<TopScorer[]> {
    const docs = await db
      .collection('top_scorers')
      .find()
      .sort({ goals: -1 })
      .toArray();

    return docs.map((doc) => ({
      playerId: doc.playerId,
      playerName: doc.playerName,
      teamId: doc.teamId,
      goals: doc.goals,
    }));
  }
}
