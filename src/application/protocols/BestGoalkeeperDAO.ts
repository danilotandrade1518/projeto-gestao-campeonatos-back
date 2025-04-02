import { Match } from '../../domain/match/Match';

export interface BestGoalkeeper {
  playerId: string;
  playerName: string;
  teamId: string;
  goalsConceded: number;
}

export interface BestGoalkeeperDAO {
  getBestGoalkeeper(): Promise<BestGoalkeeper[]>;
  update(match: Match): Promise<void>;
}
