import { MatchEventType } from '../../src/domain/events/MatchEvent';
import { Team } from '../../src/domain/match/Team';
import { db } from '../../src/shared/config';
import { RegisterMatchEventUseCase } from './../../src/application/usecases/RegisterMatchEventUseCase';
import { Match } from './../../src/domain/match/Match';
import { MongoMatchRepository } from './../../src/infrastructure/persistence/MongoMatchRepository';

const makeFakeMatch = () =>
  new Match(
    'match-1',
    new Team('teamA', 'Team A'),
    new Team('teamB', 'Team B'),
  );

describe('RegisterMatchEventUseCase (integration)', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  it('should register an event correctly', async () => {
    const repo = new MongoMatchRepository();
    const match = makeFakeMatch();
    match.start();

    await repo.save(match);

    const useCase = new RegisterMatchEventUseCase(repo);

    await useCase.execute({
      matchId: match.id,
      teamId: match.teamA.id,
      type: MatchEventType.GOAL,
      data: { playerId: 'player-1' },
    });

    const updatedMatch = await repo.getById(match.id);

    expect(updatedMatch?.getEvents()).toHaveLength(1);
    expect(updatedMatch?.getEvents()[0].type).toBe(MatchEventType.GOAL);
  });
});
