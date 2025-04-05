import {
  MatchesTableDAO,
  MatchTableItem,
} from '../../application/protocols/MatchesTableDAO';
import { db } from '../../shared/config';

export class MongoMatchesTableDAO implements MatchesTableDAO {
  private readonly collection = db.collection('matches_table');

  async getMatchesTable(): Promise<MatchTableItem[]> {
    const docs = await this.collection.find().sort({ round: 1 }).toArray();

    return docs.map((doc) => ({
      matchId: doc.matchId,
      status: doc.status,
      round: doc.round,
      teamA: doc.teamAName,
      teamB: doc.teamBName,
      date: doc.date,
    }));
  }

  async updateScore(
    matchId: string,
    teamAScore: number,
    teamBScore: number,
  ): Promise<void> {
    await this.collection.updateOne(
      { matchId },
      { $set: { teamAScore, teamBScore } },
    );
  }

  async finishMatch(matchId: string): Promise<void> {
    await this.collection.updateOne(
      { matchId },
      { $set: { status: 'finished' } },
    );
  }
}
