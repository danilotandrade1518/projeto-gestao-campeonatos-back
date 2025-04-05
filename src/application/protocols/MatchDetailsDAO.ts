export interface MatchDetails {
  teamA: {
    _id: string;
    name: string;
    players: Array<{
      _id: string;
      name: string;
      position: 'GOALKEEPER' | 'FIELD';
      inField: boolean;
      yellowCards: number;
      redCard: boolean;
      timeInField: number;
    }>;
  };
  teamB: {
    _id: string;
    name: string;
    players: Array<{
      _id: string;
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
