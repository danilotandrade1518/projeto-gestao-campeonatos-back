import { Match } from '../../domain/match/Match';

export interface TopScorer {
  playerId: string;
  playerName: string;
  teamId: string;
  goals: number;
}

export interface TopScorerDAO {
  getTopScorers(): Promise<TopScorer[]>;
  update(match: Match): Promise<void>;
}
