import { Collection } from 'mongodb';

import {
  BestGoalkeeper,
  BestGoalkeeperDAO,
} from '../../application/protocols/BestGoalkeeperDAO';
import { MatchEventType } from '../../domain/events/MatchEvent';
import { Match } from '../../domain/match/Match';
import { PlayerPosition } from '../../domain/match/Player';
import { db } from '../../shared/config';

export class MongoBestGoalkeeperDAO implements BestGoalkeeperDAO {
  private collection: Collection;

  constructor() {
    this.collection = db.collection('best_goalkeepers');
  }

  async getBestGoalkeeper(): Promise<BestGoalkeeper[]> {
    const docs = await this.collection
      .find()
      .sort({ goalsConceded: 1 })
      .toArray();

    return docs.map((doc) => ({
      playerId: doc.playerId,
      playerName: doc.playerName,
      teamId: doc.teamId,
      goalsConceded: doc.goalsConceded,
    }));
  }

  async update(match: Match): Promise<void> {
    const teamAGoals = match.events.filter(
      (e) => e.type === MatchEventType.GOAL && e.teamId === match.teamB.id,
    ).length;
    const teamBGoals = match.events.filter(
      (e) => e.type === MatchEventType.GOAL && e.teamId === match.teamA.id,
    ).length;

    const goalkeeperA = match.teamA.players.find(
      (p) => p.position === PlayerPosition.GOALKEEPER,
    );
    const goalkeeperB = match.teamB.players.find(
      (p) => p.position === PlayerPosition.GOALKEEPER,
    );

    const updates = [];

    if (goalkeeperA) {
      updates.push(
        this.collection.updateOne(
          { playerId: goalkeeperA.id },
          { $inc: { goalsConceded: teamAGoals } },
          { upsert: true },
        ),
      );
    }

    if (goalkeeperB) {
      updates.push(
        this.collection.updateOne(
          { playerId: goalkeeperB.id },
          { $inc: { goalsConceded: teamBGoals } },
          { upsert: true },
        ),
      );
    }

    await Promise.all(updates);
  }
}
