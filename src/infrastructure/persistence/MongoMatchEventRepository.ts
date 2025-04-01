import { MatchEventRepository } from '../../application/protocols/MatchEventRepository';
import { MatchEvent } from '../../domain/events/MatchEvent';
import { db } from '../../shared/config';

export class MongoMatchEventRepository implements MatchEventRepository {
  private collection = db.collection('match_events');

  async exists(eventId: string): Promise<boolean> {
    const existing = await this.collection.findOne({ id: eventId });
    return !!existing;
  }

  async saveMany(events: MatchEvent[]): Promise<void> {
    if (events.length === 0) return;
    await this.collection.insertMany(
      events.map((e) => ({
        id: e.id,
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
}
