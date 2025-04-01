export interface VoteData {
  matchId: string;
  voterId: string;
  votedPlayerId: string;
}

export interface VoteRepository {
  hasVoted(matchId: string, voterId: string): Promise<boolean>;
  save(vote: VoteData): Promise<void>;
}
