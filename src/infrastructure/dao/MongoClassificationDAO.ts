import {
  ClassificationDAO,
  TeamClassification,
} from '../../application/protocols/ClassificationDAO';
import { db } from '../../shared/config';

export class MongoClassificationDAO implements ClassificationDAO {
  async getClassification(): Promise<TeamClassification[]> {
    const docs = await db
      .collection('classification')
      .find()
      .sort({ points: -1 })
      .toArray();

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
}
