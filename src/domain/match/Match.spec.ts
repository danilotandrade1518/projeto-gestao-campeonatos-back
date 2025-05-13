import { MatchEvent, MatchEventType } from '../events/MatchEvent';
import { Match } from './Match';
import { Player, PlayerPosition } from './Player';
import { Team } from './Team';

describe('Match aggregate', () => {
  const createPlayer = (id: string) =>
    new Player(id, `Player ${id}`, PlayerPosition.FIELD);
  const createTeam = (id: string, players: Player[]) =>
    new Team(id, `Team ${id}`, players);
  const now = new Date();
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should start and track match time', async () => {
    const match = new Match('match1', createTeam('A', []), createTeam('B', []));
    expect(match.status).toBe('SCHEDULED');
    match.start();
    expect(match.status).toBe('IN_PROGRESS');
    expect(match.period).toBe('FIRST_HALF');
    await wait(20);
    expect(match.getCurrentElapsed()).toBeGreaterThanOrEqual(0);
  });

  it('should start second half and record elapsed time from first', async () => {
    const match = new Match('match1', createTeam('A', []), createTeam('B', []));
    match.start();
    await wait(10);
    match.startSecondHalf();
    expect(match.period).toBe('SECOND_HALF');
    expect(match.firstHalfElapsed).toBeGreaterThan(0);
  });

  it('should close match and calculate total time', async () => {
    const match = new Match('match1', createTeam('A', []), createTeam('B', []));
    match.start();
    await wait(10);
    match.startSecondHalf();
    await wait(10);
    match.close();
    expect(match.status).toBe('FINISHED');
    expect(match.getTotalElapsed()).toBeGreaterThan(0);
  });

  it('should track player time if never substituted', async () => {
    const player = createPlayer('p1');
    const match = new Match(
      'match1',
      createTeam('A', [player]),
      createTeam('B', []),
    );
    match.start();
    match.addEvent(
      new MatchEvent(
        'e1',
        'match1',
        MatchEventType.PLAYER_IN,
        'A',
        now,
        'FIRST_HALF',
        0,
        { playerId: player.id },
      ),
    );
    const times = match.getPlayerTimesInField();
    expect(times[player.id]).toBeGreaterThanOrEqual(0);
  });

  it('should track red card punishment', () => {
    const player = createPlayer('p1');
    const match = new Match(
      'match1',
      createTeam('A', [player]),
      createTeam('B', []),
    );
    match.start();
    match.addEvent(
      new MatchEvent(
        'e1',
        'match1',
        MatchEventType.RED_CARD,
        'A',
        now,
        'FIRST_HALF',
        0,
        { playerId: player.id },
      ),
    );
    const punishments = match.getActivePunishments();
    expect(punishments[player.id].type).toBe('RED');
    expect(punishments[player.id].minutesLeft).toBeGreaterThanOrEqual(0);
  });

  it('should add and count goals correctly', () => {
    const p1 = createPlayer('p1');
    const p2 = createPlayer('p2');
    const teamA = createTeam('A', [p1]);
    const teamB = createTeam('B', [p2]);
    const match = new Match('match1', teamA, teamB);
    match.start();
    match.addEvent(
      new MatchEvent(
        'g1',
        'match1',
        MatchEventType.GOAL,
        teamA.id,
        now,
        'FIRST_HALF',
        1,
        { playerId: p1.id },
      ),
    );
    match.addEvent(
      new MatchEvent(
        'g2',
        'match1',
        MatchEventType.GOAL,
        teamB.id,
        now,
        'FIRST_HALF',
        2,
        { playerId: p2.id },
      ),
    );
    match.addEvent(
      new MatchEvent(
        'g3',
        'match1',
        MatchEventType.GOAL,
        teamA.id,
        now,
        'SECOND_HALF',
        3,
        { playerId: p1.id },
      ),
    );
    expect(match.getGoalsCount(teamA.id)).toBe(2);
    expect(match.getGoalsCount(teamB.id)).toBe(1);
  });

  it('should return copy of events array', () => {
    const match = new Match('match1', createTeam('A', []), createTeam('B', []));
    match.start();
    match.addEvent(
      new MatchEvent(
        'e1',
        'match1',
        MatchEventType.FOUL,
        'A',
        now,
        'FIRST_HALF',
        0,
        {},
      ),
    );
    const original = match.getEvents();
    original.push(
      new MatchEvent(
        'e2',
        'match1',
        MatchEventType.FOUL,
        'A',
        now,
        'FIRST_HALF',
        1,
        {},
      ),
    );
    expect(match.getEvents().length).toBe(1);
  });

  it('should not throw when adding event without playerId', () => {
    const match = new Match('match1', createTeam('A', []), createTeam('B', []));
    match.start();
    expect(() => {
      match.addEvent(
        new MatchEvent(
          'e1',
          'match1',
          MatchEventType.PERIOD_CHANGE,
          'A',
          now,
          'FIRST_HALF',
          0,
          {},
        ),
      );
    }).not.toThrow();
  });

  it('should throw when adding event before match starts', () => {
    const match = new Match('match1', createTeam('A', []), createTeam('B', []));
    expect(() => {
      match.addEvent(
        new MatchEvent(
          'e1',
          'match1',
          MatchEventType.PLAYER_IN,
          'A',
          now,
          'FIRST_HALF',
          0,
          { playerId: 'x' },
        ),
      );
    }).toThrow('Match is not in progress');
  });

  it('should compute fouls by team and period', () => {
    const match = new Match('match1', createTeam('A', []), createTeam('B', []));
    match.start();
    match.addEvent(
      new MatchEvent(
        'f1',
        'match1',
        MatchEventType.FOUL,
        'A',
        now,
        'FIRST_HALF',
        3,
        {},
      ),
    );
    match.addEvent(
      new MatchEvent(
        'f2',
        'match1',
        MatchEventType.FOUL,
        'A',
        now,
        'SECOND_HALF',
        10,
        {},
      ),
    );
    const fouls = match.getFoulsByTeamAndPeriod();
    expect(fouls['A'].FIRST_HALF).toBe(1);
    expect(fouls['A'].SECOND_HALF).toBe(1);
  });

  it('should return player punishment time left', () => {
    const p1 = createPlayer('p1');
    const match = new Match(
      'match1',
      createTeam('A', [p1]),
      createTeam('B', []),
    );
    match.start();
    match.addEvent(
      new MatchEvent(
        'c1',
        'match1',
        MatchEventType.YELLOW_CARD,
        'A',
        now,
        'FIRST_HALF',
        0,
        { playerId: p1.id },
      ),
    );
    const punishments = match.getActivePunishments();
    expect(punishments[p1.id]).toBeDefined();
    expect(punishments[p1.id].minutesLeft).toBeGreaterThanOrEqual(0);
  });
});
