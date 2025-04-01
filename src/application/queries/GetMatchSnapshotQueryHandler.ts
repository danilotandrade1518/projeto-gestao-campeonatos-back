import { MatchDAO } from '../protocols/MatchDAO';

export class GetMatchSnapshotQueryHandler {
  constructor(private readonly matchDAO: MatchDAO) {}

  async execute(matchId: string): Promise<any> {
    const snapshot = await this.matchDAO.getMatchSnapshot(matchId);
    if (!snapshot) throw new Error('Match not found');

    return {
      matchId: snapshot.id,
      period: snapshot.period,
      timeElapsed: snapshot.timeElapsed, // tempo apenas do período atual
      totalElapsed: snapshot.totalElapsed, // soma dos períodos
      score: snapshot.score,
      players: snapshot.players,
      events: snapshot.events,
    };
  }
}
