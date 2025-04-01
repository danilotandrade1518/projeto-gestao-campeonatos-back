import { MatchRepository } from '../protocols/MatchRepository';

export class StartMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(matchId: string): Promise<void> {
    const match = await this.matchRepository.getById(matchId);
    if (!match) throw new Error('Match not found');

    match.start();

    await this.matchRepository.save(match);
  }
}
