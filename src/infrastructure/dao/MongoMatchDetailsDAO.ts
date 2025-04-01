import {
  MatchDetails,
  MatchDetailsDAO,
} from '../../application/protocols/MatchDetailsDAO';
import { db } from '../../shared/config';

export class MongoMatchDetailsDAO implements MatchDetailsDAO {
  async getMatchDetails(matchId: string): Promise<MatchDetails | null> {
    const doc = await db.collection('matches').findOne({ id: matchId });
    if (!doc) return null;

    return {
      matchId: doc.id,
      teamA: doc.teamA,
      teamB: doc.teamB,
      events: doc.events,
    };
  }
}
