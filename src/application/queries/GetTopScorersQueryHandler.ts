import { TopScorer, TopScorerDAO } from '../protocols/TopScorerDAO';

export class GetTopScorersQueryHandler {
  constructor(private readonly topScorerDAO: TopScorerDAO) {}

  async execute(): Promise<TopScorer[]> {
    return await this.topScorerDAO.getTopScorers();
  }
}
