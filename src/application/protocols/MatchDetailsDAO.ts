export interface MatchDetails {
  matchId: string;
  teamA: string;
  teamB: string;
  events: Array<any>; // depois pode ser tipado melhor
}

export interface MatchDetailsDAO {
  getMatchDetails(matchId: string): Promise<MatchDetails | null>;
}
