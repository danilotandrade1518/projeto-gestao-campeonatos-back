import { ObjectId } from 'mongodb';

import {
  MatchDetails,
  MatchDetailsDAO,
} from '../../application/protocols/MatchDetailsDAO';
import { db } from '../../shared/config';

export class MongoMatchDetailsDAO implements MatchDetailsDAO {
  async getMatchDetails(matchId: string): Promise<MatchDetails | null> {
    console.log(db.databaseName);

    const doc = await db
      .collection('matches')
      .findOne({ _id: new ObjectId(matchId) });

    console.log(doc, { _id: new ObjectId(matchId) }, matchId);

    if (!doc) return null;

    return {
      matchId: doc._id.toHexString(),
      teamA: doc.teamA,
      teamB: doc.teamB,
      events: doc.events,
    };
  }
}
