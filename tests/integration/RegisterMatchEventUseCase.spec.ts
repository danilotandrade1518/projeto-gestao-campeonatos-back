import { faker } from '@faker-js/faker';

import { MatchEventType } from '../../src/domain/events/MatchEvent';
import { Team } from '../../src/domain/match/Team';
import { client, db } from '../../src/shared/config';
import { RegisterMatchEventUseCase } from './../../src/application/usecases/RegisterMatchEventUseCase';
import { Match } from './../../src/domain/match/Match';
import { MongoMatchRepository } from './../../src/infrastructure/persistence/MongoMatchRepository';

const makeFakeMatch = () =>
  new Match(
    faker.string.hexadecimal({ length: 24, prefix: '' }),
    new Team(faker.string.hexadecimal({ length: 24, prefix: '' }), 'Team A'),
    new Team(faker.string.hexadecimal({ length: 24, prefix: '' }), 'Team B'),
  );

describe('RegisterMatchEventUseCase (integration)', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
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
      data: { playerId: faker.string.hexadecimal({ length: 24, prefix: '' }) },
    });

    const updatedMatch = await repo.getById(match.id);

    expect(updatedMatch?.getEvents()).toHaveLength(1);
    expect(updatedMatch?.getEvents()[0].type).toBe(MatchEventType.GOAL);
  });
});
