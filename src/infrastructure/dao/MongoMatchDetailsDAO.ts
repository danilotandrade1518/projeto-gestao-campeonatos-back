import { ObjectId } from 'mongodb';

import {
  MatchDetails,
  MatchDetailsDAO,
} from '../../application/protocols/MatchDetailsDAO';
import { db } from '../../shared/config';

export class MongoMatchDetailsDAO implements MatchDetailsDAO {
  async getMatchDetails(matchId: string): Promise<MatchDetails | null> {
    const doc = await db
      .collection('matches')
      .findOne({ _id: new ObjectId(matchId) });

    if (!doc) return null;

    return {
      teamA: {
        id: doc.teamA.id,
        name: doc.teamA.name,
        players: doc.teamA.players,
      },
      teamB: {
        id: doc.teamB.id,
        name: doc.teamB.name,
        players: doc.teamB.players,
      },
    };
  }
}
