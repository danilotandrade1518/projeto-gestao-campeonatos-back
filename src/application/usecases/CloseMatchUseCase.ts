import { MatchStatus } from '../../domain/match/Match';
import { MatchRepository } from '../protocols/MatchRepository';

export class CloseMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(matchId: string): Promise<void> {
    const match = await this.matchRepository.getById(matchId);
    if (!match) throw new Error('Match not found');

    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new Error('Match is not in progress');
    }

    match.close();

    await this.matchRepository.save(match);
  }
}
