export interface MatchTableItem {
  matchId: string;
  status: string;
  round: number;
  teamA: string;
  teamB: string;
  date: string;
}

export interface MatchesTableDAO {
  getMatchesTable(): Promise<MatchTableItem[]>;
  updateScore(
    matchId: string,
    teamAScore: number,
    teamBScore: number,
  ): Promise<void>;
  finishMatch(matchId: string): Promise<void>;
}
