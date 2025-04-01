export enum MatchEventType {
  GOAL = 'GOAL',
  CARD = 'CARD',
  SUBSTITUTION = 'SUBSTITUTION',
  PERIOD_CHANGE = 'PERIOD_CHANGE',
}

export enum MatchEventCard {
  YELLOW = 'YELLOW',
  RED = 'RED',
}

export interface MatchEventData {
  playerId?: string;
  playerIn?: string;
  playerOut?: string;
  cardType?: MatchEventCard;
}

export class MatchEvent {
  constructor(
    public readonly id: string,
    public readonly matchId: string,
    public readonly type: MatchEventType,
    public readonly teamId: string,
    public readonly timestamp: Date,
    public period: string,
    public minute: number,
    public readonly data: MatchEventData,
  ) {}
}
