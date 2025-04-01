export interface MatchSnapshotDTO {
  id: string;
  period: string; // FIRST_HALF | SECOND_HALF | FINISHED
  timeElapsed: number; // Tempo atual do período em minutos
  totalElapsed: number; // Soma de todos os períodos
  score: { teamA: number; teamB: number };
  players: Array<{
    playerId: string;
    name: string;
    teamId: string;
    timeInField: number;
    inField: boolean;
    yellowCards: number;
    redCard: boolean;
  }>;
  events: Array<any>; // MatchEventDTO pode ser tipado melhor futuramente
}

export interface MatchDAO {
  getMatchSnapshot(matchId: string): Promise<MatchSnapshotDTO | null>;
}
