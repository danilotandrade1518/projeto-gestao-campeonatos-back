import { ObjectId } from 'mongodb';

import { MatchEventRepository } from '../../application/protocols/MatchEventRepository';
import { MatchEvent } from '../../domain/events/MatchEvent';
import { db } from '../../shared/config';

export class MongoMatchEventRepository implements MatchEventRepository {
  private collection = db.collection('match_events');

  async exists(eventId: string): Promise<boolean> {
    const existing = await this.collection.findOne({
      _id: new ObjectId(eventId),
    });
    return !!existing;
  }

  async saveMany(events: MatchEvent[]): Promise<void> {
    if (events.length === 0) return;

    await this.collection.insertMany(
      events.map((e) => ({
        _id: new ObjectId(e.id),
        matchId: e.matchId,
        type: e.type,
        teamId: e.teamId,
        timestamp: e.timestamp,
        period: e.period,
        minute: e.minute,
        data: e.data,
      })),
    );
  }

  async getByMatchId(matchId: string): Promise<MatchEvent[]> {
    const documents = await this.collection
      .find({ matchId })
      .sort({ timestamp: 1 })
      .toArray();

    return documents.map((doc) =>
      MatchEvent.restore({
        id: doc._id.toHexString(),
        matchId: doc.matchId,
        type: doc.type,
        teamId: doc.teamId,
        timestamp: new Date(doc.timestamp),
        period: doc.period,
        minute: doc.minute,
        data: doc.data,
      }),
    );
  }
}
