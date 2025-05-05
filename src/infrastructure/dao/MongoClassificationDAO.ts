import { Collection } from 'mongodb';
import {
  ClassificationDAO,
  TeamClassification,
} from '../../application/protocols/ClassificationDAO';
import { db } from '../../shared/config';
import { Match } from '../../domain/match/Match';

export class MongoClassificationDAO implements ClassificationDAO {
  private collection: Collection;

  constructor() {
    this.collection = db.collection('classification');
  }

  async getClassification(): Promise<TeamClassification[]> {
    const docs = await this.collection.find().sort({ points: -1 }).toArray();

    return docs.map((doc) => ({
      teamId: doc.teamId,
      teamName: doc.teamName,
      points: doc.points,
      wins: doc.wins,
      draws: doc.draws,
      losses: doc.losses,
      goalsScored: doc.goalsScored,
      goalsConceded: doc.goalsConceded,
      goalDifference: doc.goalDifference,
      yellowCards: doc.yellowCards,
      redCards: doc.redCards,
    }));
  }

  async update(match: Match): Promise<void> {
    const teamAScore = match.calculateScore(match.teamA.id);
    const teamBScore = match.calculateScore(match.teamB.id);

    await Promise.all([
      this.collection.updateOne(
        { teamId: match.teamA.id },
        {
          $set: {
            points: teamAScore.points,
            goalsScored: teamAScore.goals,
            goalsConceded: teamBScore.goals,
          },
        },
        { upsert: true },
      ),
      this.collection.updateOne(
        { teamId: match.teamB.id },
        {
          $set: {
            points: teamBScore.points,
            goalsScored: teamBScore.goals,
            goalsConceded: teamAScore.goals,
          },
        },
        { upsert: true },
      ),
    ]);
  }
}
