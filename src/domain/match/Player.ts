import { MatchEventCard } from '../events/MatchEvent';

export enum PlayerPosition {
  GOALKEEPER = 'GOALKEEPER',
  FIELD = 'FIELD',
}

export class Player {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _position: PlayerPosition,
    private _inField: boolean = false,
    private _yellowCards: number = 0,
    private _redCard: boolean = false,
    private _timeInField: number = 0,
  ) {}

  public get id(): string {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get position(): PlayerPosition {
    return this._position;
  }
  public get inField(): boolean {
    return this._inField;
  }
  public get yellowCards(): number {
    return this._yellowCards;
  }
  public get redCard(): boolean {
    return this._redCard;
  }
  public get timeInField(): number {
    return this._timeInField;
  }

  public enterField(): void {
    this._inField = true;
  }

  public leaveField(): void {
    this._inField = false;
  }

  public giveCard(type: MatchEventCard): void {
    switch (type) {
      case MatchEventCard.YELLOW:
        this._yellowCards++;
        break;
      case MatchEventCard.RED:
        this._redCard = true;
        break;
    }
  }
}
