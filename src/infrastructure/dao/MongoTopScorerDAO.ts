import { Collection } from 'mongodb';

import {
  TopScorer,
  TopScorerDAO,
} from '../../application/protocols/TopScorerDAO';
import { MatchEventType } from '../../domain/events/MatchEvent';
import { Match } from '../../domain/match/Match';
import { db } from '../../shared/config';

export class MongoTopScorerDAO implements TopScorerDAO {
  private collection: Collection;

  constructor() {
    this.collection = db.collection('top_scorers');
  }

  async getTopScorers(): Promise<TopScorer[]> {
    const docs = await this.collection.find().sort({ goals: -1 }).toArray();

    return docs.map((doc) => ({
      playerId: doc.playerId,
      playerName: doc.playerName,
      teamId: doc.teamId,
      goals: doc.goals,
    }));
  }

  async update(match: Match): Promise<void> {
    const goals = match.events.filter((e) => e.type === MatchEventType.GOAL);

    const getGoalsCountByPlayerId = (playerId: string) =>
      goals.filter((goal) => goal.data.playerId === playerId).length;

    const updates = goals.map((goal) => {
      const playerId = goal.data.playerId!;

      return this.collection.updateOne(
        { playerId: playerId },
        { $set: { goals: getGoalsCountByPlayerId(playerId) } },
        { upsert: true },
      );
    });

    await Promise.all(updates);
  }
}
