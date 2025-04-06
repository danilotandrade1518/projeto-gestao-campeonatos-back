export interface MatchDetails {
  id: string;
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
    goals: number;
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
