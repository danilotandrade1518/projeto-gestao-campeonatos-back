import { MatchEvent, MatchEventType } from '../events/MatchEvent';
import { Team } from './Team';

export enum MatchPeriod {
  FIRST_HALF = 'FIRST_HALF',
  SECOND_HALF = 'SECOND_HALF',
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export class Match {
  private _status: MatchStatus = MatchStatus.SCHEDULED;
  private _period: MatchPeriod = MatchPeriod.FIRST_HALF;

  private _currentPeriodStartTime: Date | null = null;
  private _firstHalfElapsed: number = 0; // em minutos
  private _secondHalfElapsed: number = 0; // em minutos

  private _events: MatchEvent[] = [];

  constructor(
    private readonly _id: string,
    private readonly _teamA: Team,
    private readonly _teamB: Team,
  ) {}

  get id(): string {
    return this._id;
  }
  get teamA(): Team {
    return this._teamA;
  }
  get teamB(): Team {
    return this._teamB;
  }
  get status(): MatchStatus {
    return this._status;
  }
  get period(): MatchPeriod {
    return this._period;
  }
  get currentPeriodStartTime(): Date | null {
    return this._currentPeriodStartTime;
  }
  get firstHalfElapsed(): number {
    return this._firstHalfElapsed;
  }
  get secondHalfElapsed(): number {
    return this._secondHalfElapsed;
  }
  get events(): MatchEvent[] {
    return this._events;
  }

  public start(): void {
    if (this._status !== MatchStatus.SCHEDULED)
      throw new Error('Invalid match status');
    this._status = MatchStatus.IN_PROGRESS;
    this._period = MatchPeriod.FIRST_HALF;
    this._currentPeriodStartTime = new Date();
  }

  public startSecondHalf(): void {
    if (this._period !== MatchPeriod.FIRST_HALF)
      throw new Error('Cannot start second half');
    this._firstHalfElapsed = this.getCurrentElapsed();
    this._period = MatchPeriod.SECOND_HALF;
    this._currentPeriodStartTime = new Date();
  }

  public close(): void {
    if (this._status !== MatchStatus.IN_PROGRESS)
      throw new Error('Match is not in progress');

    // Atualiza o tempo acumulado do segundo tempo antes de encerrar
    if (this._period === 'SECOND_HALF') {
      this._secondHalfElapsed = this.getCurrentElapsed();
    } else if (this._period === 'FIRST_HALF') {
      this._firstHalfElapsed = this.getCurrentElapsed();
      this._secondHalfElapsed = 0; // nunca chegou a ter segundo tempo
    }

    switch (this._period) {
      case MatchPeriod.FIRST_HALF:
        this._firstHalfElapsed = this.getCurrentElapsed();
        break;
      case MatchPeriod.SECOND_HALF:
        this._secondHalfElapsed = this.getCurrentElapsed();
        break;
      default:
        throw new Error('Invalid match period');
    }

    this._status = MatchStatus.FINISHED;
  }

  public getCurrentElapsed(): number {
    if (!this._currentPeriodStartTime) return 0;
    return Math.floor(
      (Date.now() - this._currentPeriodStartTime.getTime()) / 60000,
    );
  }

  public getTotalElapsed(): number {
    const current =
      this._status === MatchStatus.IN_PROGRESS ? this.getCurrentElapsed() : 0;
    return this._firstHalfElapsed + this._secondHalfElapsed + current;
  }

  public calculateScore(teamId: string): { points: number; goals: number } {
    if (this.status !== MatchStatus.FINISHED) return { points: 0, goals: 0 };

    const teamAGoals = this.events.filter(
      (e) => e.type === MatchEventType.GOAL && e.teamId === this.teamA.id,
    ).length;
    const teamBGoals = this.events.filter(
      (e) => e.type === MatchEventType.GOAL && e.teamId === this.teamB.id,
    ).length;

    const isTeamA = teamId === this.teamA.id;
    const goals = isTeamA ? teamAGoals : teamBGoals;

    let points = 0;
    if (teamAGoals > teamBGoals) points = isTeamA ? 2 : 0;
    else if (teamBGoals > teamAGoals) points = isTeamA ? 0 : 2;
    else points = 1;

    return { points, goals };
  }

  public addEvent(event: MatchEvent): void {
    if (this._status !== 'IN_PROGRESS')
      throw new Error('Match is not in progress');
    this._events.push(event);
  }

  public getEvents(): MatchEvent[] {
    return [...this._events];
  }

  public static restore(props: {
    id: string;
    teamA: Team;
    teamB: Team;
    status: MatchStatus;
    period: MatchPeriod;
    firstHalfElapsed: number;
    secondHalfElapsed: number;
    currentPeriodStartTime: Date | null;
    events: MatchEvent[];
  }): Match {
    const match = new Match(props.id, props.teamA, props.teamB);
    match._status = props.status;
    match._period = props.period;
    match._firstHalfElapsed = props.firstHalfElapsed;
    match._secondHalfElapsed = props.secondHalfElapsed;
    match._currentPeriodStartTime = props.currentPeriodStartTime;
    match._events = props.events;
    return match;
  }
}
