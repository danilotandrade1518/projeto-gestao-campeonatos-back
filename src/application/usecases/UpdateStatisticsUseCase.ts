import { BestGoalkeeperDAO } from '../protocols/BestGoalkeeperDAO';
import { ClassificationDAO } from '../protocols/ClassificationDAO';
import { MatchRepository } from '../protocols/MatchRepository';
import { TopScorerDAO } from '../protocols/TopScorerDAO';

export class UpdateStatisticsUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly classificationDAO: ClassificationDAO,
    private readonly topScorerDAO: TopScorerDAO,
    private readonly bestGoalkeeperDAO: BestGoalkeeperDAO,
  ) {}

  async execute(matchId: string): Promise<void> {
    const match = await this.matchRepository.getById(matchId);

    if (!match) throw new Error('Match not found');

    await this.classificationDAO.update(match);
    await this.topScorerDAO.update(match);
    await this.bestGoalkeeperDAO.update(match);
  }
}
