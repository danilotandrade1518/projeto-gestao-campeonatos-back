import {
  BestGoalkeeper,
  BestGoalkeeperDAO,
} from '../../application/protocols/BestGoalkeeperDAO';
import { db } from '../../shared/config';

export class MongoBestGoalkeeperDAO implements BestGoalkeeperDAO {
  async getBestGoalkeeper(): Promise<BestGoalkeeper[]> {
    const docs = await db
      .collection('best_goalkeepers')
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
}
