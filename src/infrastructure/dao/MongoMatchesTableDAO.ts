import {
  MatchesTableDAO,
  MatchTableItem,
} from '../../application/protocols/MatchesTableDAO';
import { db } from '../../shared/config';

export class MongoMatchesTableDAO implements MatchesTableDAO {
  async getMatchesTable(): Promise<MatchTableItem[]> {
    const docs = await db
      .collection('matches_table')
      .find()
      .sort({ round: 1 })
      .toArray();

    return docs.map((doc) => ({
      matchId: doc.matchId,
      round: doc.round,
      teamA: doc.teamA,
      teamB: doc.teamB,
      date: doc.date,
    }));
  }
}
