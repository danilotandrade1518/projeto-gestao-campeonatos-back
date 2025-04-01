import { MatchesTableDAO, MatchTableItem } from '../protocols/MatchesTableDAO';

export class GetMatchesTableQueryHandler {
  constructor(private readonly matchesTableDAO: MatchesTableDAO) {}

  async execute(): Promise<MatchTableItem[]> {
    return await this.matchesTableDAO.getMatchesTable();
  }
}
