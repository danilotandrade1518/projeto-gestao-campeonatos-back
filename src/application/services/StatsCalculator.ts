import { Match } from '../../domain/match/Match';

export class StatsCalculator {
  static calculateScore(match: Match): { teamA: number; teamB: number } {
    return match.getScore();
  }

  static calculatePlayerStats(match: Match): Record<
    string,
    {
      goals: number;
      yellowCards: number;
      redCards: number;
      timeInField: number;
    }
  > {
    const stats: Record<string, any> = {};

    for (const player of match.getPlayersInField()) {
      stats[player.id] = {
        goals: match
          .getEvents()
          .filter((e) => e.type === 'GOAL' && e.data.playerId === player.id)
          .length,
        yellowCards: player.yellowCards,
        redCards: player.redCard ? 1 : 0,
        timeInField: player.timeInField,
      };
    }

    return stats;
  }
}
