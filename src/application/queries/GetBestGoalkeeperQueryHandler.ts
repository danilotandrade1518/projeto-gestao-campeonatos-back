import {
  BestGoalkeeper,
  BestGoalkeeperDAO,
} from '../protocols/BestGoalkeeperDAO';

export class GetBestGoalkeeperQueryHandler {
  constructor(private readonly bestGoalkeeperDAO: BestGoalkeeperDAO) {}

  async execute(): Promise<BestGoalkeeper[]> {
    return await this.bestGoalkeeperDAO.getBestGoalkeeper();
  }
}
