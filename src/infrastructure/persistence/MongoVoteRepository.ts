import {
  VoteData,
  VoteRepository,
} from '../../application/protocols/VoteRepository';
import { db } from '../../shared/config';

export class MongoVoteRepository implements VoteRepository {
  private collection = db.collection('votes');

  async hasVoted(matchId: string, voterId: string): Promise<boolean> {
    const existingVote = await this.collection.findOne({ matchId, voterId });
    return !!existingVote;
  }

  async save(vote: VoteData): Promise<void> {
    await this.collection.insertOne(vote);
  }
}
