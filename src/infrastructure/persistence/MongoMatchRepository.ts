import { Collection } from 'mongodb';

import { MatchRepository } from '../../application/protocols/MatchRepository';
import { Match } from '../../domain/match/Match';
import { Team } from '../../domain/match/Team';
import { db } from '../../shared/config';

export class MongoMatchRepository implements MatchRepository {
  private collection: Collection;

  constructor() {
    this.collection = db.collection('matches');
  }

  async getById(matchId: string): Promise<Match | null> {
    const doc = await this.collection.findOne({ id: matchId });
    if (!doc) return null;

    return Match.restore({
      id: doc.id,
      teamA: Team.restore({
        id: doc.teamA.id,
        name: doc.teamA.name,
        players: doc.teamA.players,
      }),
      teamB: Team.restore({
        id: doc.teamB.id,
        name: doc.teamB.name,
        players: doc.teamB.players,
      }),
      status: doc.status,
      period: doc.period,
      firstHalfElapsed: doc.firstHalfElapsed || 0,
      secondHalfElapsed: doc.secondHalfElapsed || 0,
      currentPeriodStartTime: doc.currentPeriodStartTime
        ? new Date(doc.currentPeriodStartTime)
        : null,
      events: doc.events || [],
    });
  }

  async save(match: Match): Promise<void> {
    await this.collection.updateOne(
      { id: match.id },
      {
        $set: {
          id: match.id,
          teamA: {
            id: match.teamA.id,
            name: match.teamA.name,
            players: match.teamA.players,
          },
          teamB: {
            id: match.teamB.id,
            name: match.teamB.name,
            players: match.teamB.players,
          },
          status: match.status,
          period: match.period,
          firstHalfElapsed: match.firstHalfElapsed || 0,
          secondHalfElapsed: match.secondHalfElapsed || 0,
          currentPeriodStartTime: match.currentPeriodStartTime
            ? new Date(match.currentPeriodStartTime)
            : null,
          events: match.events || [],
        },
      },
      { upsert: true },
    );
  }
}
