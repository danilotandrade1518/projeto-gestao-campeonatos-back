import { Match } from '../../domain/match/Match';

export interface MatchRepository {
  getById(matchId: string): Promise<Match | null>;
  save(match: Match): Promise<void>;
}
