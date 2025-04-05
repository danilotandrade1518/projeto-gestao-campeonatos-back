export interface MatchDetails {
  teamA: {
    id: string;
    name: string;
    players: Array<{
      id: string;
      name: string;
      position: 'GOALKEEPER' | 'FIELD';
      inField: boolean;
      yellowCards: number;
      redCard: boolean;
      timeInField: number;
    }>;
  };
  teamB: {
    id: string;
    name: string;
    players: Array<{
      id: string;
      name: string;
      position: 'GOALKEEPER' | 'FIELD';
      inField: boolean;
      yellowCards: number;
      redCard: boolean;
      timeInField: number;
    }>;
  };
}

export interface MatchDetailsDAO {
  getMatchDetails(matchId: string): Promise<MatchDetails | null>;
}
