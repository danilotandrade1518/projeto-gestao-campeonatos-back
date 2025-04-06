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

    const events = doc.events || [];

    const teamAGoals = events.filter(
      (e: any) => e.type === 'GOAL' && e.teamId === doc.teamA._id.toHexString(),
    ).length;
    const teamBGoals = events.filter(
      (e: any) => e.type === 'GOAL' && e.teamId === doc.teamB._id.toHexString(),
    ).length;

    return {
      id: doc._id.toString(),
      teamA: {
        id: doc.teamA._id,
        name: doc.teamA.name,
        players: doc.teamA.players,
        goals: teamAGoals,
      },
      teamB: {
        id: doc.teamB._id,
        name: doc.teamB.name,
        players: doc.teamB.players,
        goals: teamBGoals,
      },
      events: events.map((e: any) => ({
        id: e._id.toHexString(),
        type: e.type,
        teamId: e.teamId,
        minute: e.minute,
        timestamp: e.timestamp,
        data: e.data,
      })),
    };
  }
}
