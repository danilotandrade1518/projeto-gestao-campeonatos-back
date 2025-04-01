import {
  MatchDAO,
  MatchSnapshotDTO,
} from '../../application/protocols/MatchDAO';
import { db } from '../../shared/config';

export class MongoMatchDAO implements MatchDAO {
  async getMatchSnapshot(matchId: string): Promise<MatchSnapshotDTO | null> {
    const doc = await db.collection('matches').findOne({ id: matchId });
    if (!doc) return null;

    const now = new Date();
    const currentElapsed = doc.currentPeriodStartTime
      ? Math.floor(
          (now.getTime() - new Date(doc.currentPeriodStartTime).getTime()) /
            60000,
        )
      : 0;

    return {
      id: doc.id,
      period: doc.period,
      timeElapsed: currentElapsed,
      totalElapsed:
        doc.firstHalfElapsed + doc.secondHalfElapsed + currentElapsed,
      score: doc.score,
      players: doc.players,
      events: doc.events,
    };
  }
}
