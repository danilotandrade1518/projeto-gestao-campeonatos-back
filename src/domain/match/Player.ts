import { MatchEventCard } from '../events/MatchEvent';

export enum PlayerPosition {
  GOALKEEPER = 'GOALKEEPER',
  FIELD = 'FIELD',
}

export class Player {
  private _entryTimeMinutes: number | null = null;

  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _position: PlayerPosition,
    private _inField: boolean = false,
    private _yellowCards: number = 0,
    private _redCard: boolean = false,
    private _timeInField: number = 0,
    private _lastPunishmentAt: number | null = null,
    private _lastPunishmentType: MatchEventCard | null = null,
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
  public get entryTimeMinutes() {
    return this._entryTimeMinutes;
  }
  public get lastPunishmentAt() {
    return this._entryTimeMinutes;
  }
  public get lastPunishmentType() {
    return this._entryTimeMinutes;
  }

  public enterField(currentMinute: number): void {
    this._inField = true;
    this._entryTimeMinutes = currentMinute;
  }

  public leaveField(currentMinute: number): void {
    this._inField = false;
    if (this._entryTimeMinutes !== null) {
      this._timeInField += currentMinute - this._entryTimeMinutes;
      this._entryTimeMinutes = null;
    }
  }

  public giveCard(type: MatchEventCard, currentMinute: number): void {
    if (type === MatchEventCard.YELLOW) {
      this._yellowCards++;
    } else {
      this._redCard = true;
    }
    this._lastPunishmentAt = currentMinute;
    this._lastPunishmentType = type;
  }

  public getTotalTimeInField(currentMinute: number): number {
    return this._inField && this._entryTimeMinutes !== null
      ? this._timeInField + (currentMinute - this._entryTimeMinutes)
      : this._timeInField;
  }

  public getPunishmentTimeLeft(currentMinute: number): number | null {
    if (!this._lastPunishmentAt || !this._lastPunishmentType) return null;

    const duration = this._lastPunishmentType === MatchEventCard.YELLOW ? 3 : 5;
    const elapsed = currentMinute - this._lastPunishmentAt;
    return elapsed < duration ? duration - elapsed : null;
  }

  public static restore(props: {
    id: string;
    name: string;
    position: PlayerPosition;
    inField: boolean;
    yellowCards: number;
    redCard: boolean;
    timeInField: number;
    entryTimeMinutes: number | null;
    lastPunishmentAt: number | null;
    lastPunishmentType: MatchEventCard | null;
  }): Player {
    const player = new Player(
      props.id,
      props.name,
      props.position,
      props.inField,
      props.yellowCards,
      props.redCard,
      props.timeInField,
    );

    player._entryTimeMinutes = props.entryTimeMinutes;
    player._lastPunishmentAt = props.lastPunishmentAt;
    player._lastPunishmentType = props.lastPunishmentType;

    return player;
  }
}
