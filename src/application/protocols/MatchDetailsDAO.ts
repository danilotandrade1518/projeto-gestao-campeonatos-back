export interface MatchDetails {
  id: string;
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
    goals: number;
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
    goals: number;
  };
  events: Array<{
    id: string;
    type: 'GOAL' | 'CARD' | 'SUBSTITUTION';
    teamId: string;
    minute: number;
    timestamp: string;
    data: any;
  }>;
}

export interface MatchDetailsDAO {
  getMatchDetails(matchId: string): Promise<MatchDetails | null>;
}
