import { Match } from '../../domain/match/Match';

export interface TeamClassification {
  teamId: string;
  teamName: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
  yellowCards: number;
  redCards: number;
}

export interface ClassificationDAO {
  getClassification(): Promise<TeamClassification[]>;
  update(match: Match): Promise<void>;
}
