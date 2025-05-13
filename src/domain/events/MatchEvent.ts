export enum MatchEventType {
  GOAL = 'GOAL',
  SUBSTITUTION = 'SUBSTITUTION',
  PERIOD_CHANGE = 'PERIOD_CHANGE',
  PLAYER_IN = 'PLAYER_IN',
  PLAYER_OUT = 'PLAYER_OUT',
  FOUL = 'FOUL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
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

  public static isPlayerEvent(type: MatchEventType): boolean {
    return [
      MatchEventType.PLAYER_IN,
      MatchEventType.PLAYER_OUT,
      MatchEventType.YELLOW_CARD,
      MatchEventType.RED_CARD,
    ].includes(type);
  }

  public static restore(props: {
    id: string;
    matchId: string;
    type: MatchEventType;
    teamId: string;
    timestamp: Date;
    period: string;
    minute: number;
    data: MatchEventData;
  }): MatchEvent {
    return new MatchEvent(
      props.id,
      props.matchId,
      props.type,
      props.teamId,
      props.timestamp,
      props.period,
      props.minute,
      props.data,
    );
  }
}
