import { Match } from '../../domain/match/Match';
import { BestGoalkeeperDAO } from '../protocols/BestGoalkeeperDAO';
import { ClassificationDAO } from '../protocols/ClassificationDAO';
import { TopScorerDAO } from '../protocols/TopScorerDAO';
import { UpdateStatisticsService } from '../protocols/UpdateStatisticsService';

export class DefaultUpdateStatisticsService implements UpdateStatisticsService {
  constructor(
    private readonly classificationDAO: ClassificationDAO,
    private readonly topScorerDAO: TopScorerDAO,
    private readonly bestGoalkeeperDAO: BestGoalkeeperDAO,
  ) {}

  async update(match: Match): Promise<void> {
    if (match.status !== 'FINISHED') return;

    await this.classificationDAO.update(match);
    await this.topScorerDAO.update(match);
    await this.bestGoalkeeperDAO.update(match);
  }
}
