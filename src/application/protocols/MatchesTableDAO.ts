export interface MatchTableItem {
  matchId: string;
  round: number;
  teamA: string;
  teamB: string;
  date: string;
}

export interface MatchesTableDAO {
  getMatchesTable(): Promise<MatchTableItem[]>;
}
