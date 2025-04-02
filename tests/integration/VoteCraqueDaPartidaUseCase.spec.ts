import { faker } from '@faker-js/faker';

import { Match } from '../../src/domain/match/Match';
import { Team } from '../../src/domain/match/Team';
import { client, db } from '../../src/shared/config';
import { VoteCraqueDaPartidaUseCase } from './../../src/application/usecases/VoteCraqueDaPartidaUseCase';
import { MongoMatchRepository } from './../../src/infrastructure/persistence/MongoMatchRepository';
import { MongoVoteRepository } from './../../src/infrastructure/persistence/MongoVoteRepository';

describe('VoteCraqueDaPartidaUseCase', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should register a vote', async () => {
    const matchRepo = new MongoMatchRepository();
    const voteRepo = new MongoVoteRepository();
    const match = new Match(
      faker.string.hexadecimal({ length: 24, prefix: '' }),
      new Team(faker.string.hexadecimal({ length: 24, prefix: '' }), 'Team A'),
      new Team(faker.string.hexadecimal({ length: 24, prefix: '' }), 'Team B'),
    );
    match.start();
    await matchRepo.save(match);

    const useCase = new VoteCraqueDaPartidaUseCase(matchRepo, voteRepo);

    const voterId = faker.string.hexadecimal({ length: 24, prefix: '' });

    await useCase.execute({
      matchId: match.id,
      voterId,
      votedPlayerId: faker.string.hexadecimal({ length: 24, prefix: '' }),
    });

    const exists = await voteRepo.hasVoted(match.id, voterId);
    expect(exists).toBe(true);
  });
});
