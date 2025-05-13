import { Player } from './Player';

export class Team {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _players: Player[] = [],
  ) {}

  public get id(): string {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get players(): Player[] {
    return this._players;
  }

  public getPlayerById(playerId: string): Player | undefined {
    return this._players.find((p) => p.id === playerId);
  }

  public getPlayers(): Player[] {
    return [...this._players];
  }

  public getAllPlayersInField(): Player[] {
    return this._players.filter((p) => p.inField);
  }

  public getTotalCards(): number {
    return this._players.reduce(
      (acc, p) => acc + p.yellowCards + (p.redCard ? 2 : 0),
      0,
    );
  }

  public getPlayerTimes(currentMinute: number): Record<string, number> {
    return Object.fromEntries(
      this._players.map((p) => [p.id, p.getTotalTimeInField(currentMinute)]),
    );
  }

  public getActivePunishments(
    currentMinute: number,
  ): Record<string, { type: 'YELLOW' | 'RED'; minutesLeft: number }> {
    const result: Record<
      string,
      { type: 'YELLOW' | 'RED'; minutesLeft: number }
    > = {};
    for (const p of this._players) {
      const minutesLeft = p.getPunishmentTimeLeft(currentMinute);
      if (minutesLeft !== null) {
        result[p.id] = {
          type: p.redCard ? 'RED' : 'YELLOW',
          minutesLeft,
        };
      }
    }
    return result;
  }

  public static restore(props: {
    id: string;
    name: string;
    players: Player[];
  }): Team {
    return new Team(props.id, props.name, props.players);
  }
}
