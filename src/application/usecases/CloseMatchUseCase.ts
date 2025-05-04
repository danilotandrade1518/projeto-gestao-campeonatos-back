import { MatchStatus } from '../../domain/match/Match';
import { MatchesTableDAO } from '../protocols/MatchesTableDAO';
import { MatchRepository } from '../protocols/MatchRepository';
import { MessageQueuePublisher } from '../protocols/MessageQueuePublisher';

export class CloseMatchUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchesTableDAO: MatchesTableDAO,
    private readonly queuePublisher: MessageQueuePublisher,
  ) {}

  async execute(matchId: string): Promise<void> {
    const match = await this.matchRepository.getById(matchId);
    if (!match) throw new Error('Match not found');

    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new Error('Match is not in progress');
    }

    match.close();

    await this.matchRepository.save(match);
    await this.matchesTableDAO.finishMatch(match.id);
    await this.queuePublisher.publish(match);
  }
}
