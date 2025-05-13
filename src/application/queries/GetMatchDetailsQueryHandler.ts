import { MatchEventRepository } from '../../application/protocols/MatchEventRepository';
import { MatchRepository } from '../../application/protocols/MatchRepository';

interface GetMatchDetailsInput {
  matchId: string;
}

interface GetMatchDetailsOutput {
  id: string;
  teamA: {
    id: string;
    name: string;
  };
  teamB: {
    id: string;
    name: string;
  };
  status: string;
  period: string;
  firstHalfElapsed: number;
  secondHalfElapsed: number;
  playerTimes: Record<string, number>;
  foulsByTeam: Record<string, { FIRST_HALF: number; SECOND_HALF: number }>;
  punishments: Record<string, { type: 'YELLOW' | 'RED'; minutesLeft: number }>;
}

export class GetMatchDetailsQueryHandler {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchEventRepository: MatchEventRepository,
  ) {}

  async execute(input: GetMatchDetailsInput): Promise<GetMatchDetailsOutput> {
    const match = await this.matchRepository.getById(input.matchId);
    if (!match) throw new Error('Match not found');

    const events = await this.matchEventRepository.getByMatchId(input.matchId);
    for (const event of events) {
      match.addEvent(event);
    }

    return {
      id: match.id,
      teamA: {
        id: match.teamA.id,
        name: match.teamA.name,
      },
      teamB: {
        id: match.teamB.id,
        name: match.teamB.name,
      },
      status: match.status,
      period: match.period,
      firstHalfElapsed: match.firstHalfElapsed,
      secondHalfElapsed: match.secondHalfElapsed,
      playerTimes: match.getPlayerTimesInField(),
      foulsByTeam: match.getFoulsByTeamAndPeriod(),
      punishments: match.getActivePunishments(),
    };
  }
}
