import { MatchDetails, MatchDetailsDAO } from '../protocols/MatchDetailsDAO';

export class GetPublicMatchDetailsQueryHandler {
  constructor(private readonly matchDetailsDAO: MatchDetailsDAO) {}

  async execute(matchId: string): Promise<MatchDetails> {
    const details = await this.matchDetailsDAO.getMatchDetails(matchId);
    if (!details) throw new Error('Match not found');
    return details;
  }
}
