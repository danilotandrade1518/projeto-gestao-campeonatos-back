import { Match } from '../../domain/match/Match';

export interface UpdateStatisticsService {
  update(match: Match): Promise<void>;
}
