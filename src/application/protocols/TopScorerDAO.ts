export interface TopScorer {
  playerId: string;
  playerName: string;
  teamId: string;
  goals: number;
}

export interface TopScorerDAO {
  getTopScorers(): Promise<TopScorer[]>;
}
