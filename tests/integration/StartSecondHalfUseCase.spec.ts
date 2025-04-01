import { Match, MatchPeriod } from '../../src/domain/match/Match';
import { Team } from '../../src/domain/match/Team';
import { client, db } from '../../src/shared/config';
import { StartSecondHalfUseCase } from './../../src/application/usecases/StartSecondHalfUseCase';
import { MongoMatchRepository } from './../../src/infrastructure/persistence/MongoMatchRepository';

describe('StartSecondHalfUseCase', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should start the second half', async () => {
    const repo = new MongoMatchRepository();
    const match = new Match(
      'm2',
      new Team('t1', 'Team A'),
      new Team('t2', 'Team B'),
    );

    match.start();
    await repo.save(match);

    const useCase = new StartSecondHalfUseCase(repo);

    await useCase.execute(match.id);

    const result = await repo.getById(match.id);
    expect(result?.period).toBe(MatchPeriod.SECOND_HALF);
  });
});
