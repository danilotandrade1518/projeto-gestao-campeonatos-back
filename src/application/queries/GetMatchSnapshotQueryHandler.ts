import { MatchEventRepository } from '../../application/protocols/MatchEventRepository';
import { MatchRepository } from '../../application/protocols/MatchRepository';

interface MatchSnapshot {
  matchId: string;
  period: string;
  timeElapsed: number;
  totalElapsed: number;
  score: {
    teamA: number;
    teamB: number;
  };
  players: {
    id: string;
    name: string;
    teamId: string;
    inField: boolean;
  }[];
  events: {
    id: string;
    type: string;
    teamId: string;
    minute: number;
    playerId?: string;
  }[];
}

export class GetMatchSnapshotQueryHandler {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchEventRepository: MatchEventRepository,
  ) {}

  async execute(matchId: string): Promise<MatchSnapshot> {
    const match = await this.matchRepository.getById(matchId);
    if (!match) throw new Error('Match not found');

    const events = await this.matchEventRepository.getByMatchId(matchId);
    for (const event of events) {
      match.addEvent(event);
    }

    const players = [
      ...match.teamA.players.map((p) => ({
        id: p.id,
        name: p.name,
        teamId: match.teamA.id,
        inField: p.inField,
      })),
      ...match.teamB.players.map((p) => ({
        id: p.id,
        name: p.name,
        teamId: match.teamB.id,
        inField: p.inField,
      })),
    ];

    return {
      matchId: match.id,
      period: match.period,
      timeElapsed: match.getCurrentElapsed(),
      totalElapsed: match.getTotalElapsed(),
      score: {
        teamA: match.getGoalsCount(match.teamA.id),
        teamB: match.getGoalsCount(match.teamB.id),
      },
      players,
      events: events.map((e) => ({
        id: e.id,
        type: e.type,
        teamId: e.teamId,
        minute: e.minute,
        playerId: e.data?.playerId,
      })),
    };
  }
}
