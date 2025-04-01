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

  public getPlayersInField(): Player[] {
    return this.players.filter((p) => p.inField);
  }

  public getTotalCards(): number {
    return this.players.reduce(
      (acc, p) => acc + p.yellowCards + (p.redCard ? 2 : 0),
      0,
    );
  }

  public static restore(props: {
    id: string;
    name: string;
    players: Player[];
  }): Team {
    const team = new Team(props.id, props.name, props.players);
    return team;
  }
}
