import { Match, MatchStatus } from '../../src/domain/match/Match';
import { Team } from '../../src/domain/match/Team';
import { client, db } from '../../src/shared/config';
import { CloseMatchUseCase } from './../../src/application/usecases/CloseMatchUseCase';
import { MongoMatchRepository } from './../../src/infrastructure/persistence/MongoMatchRepository';

describe('CloseMatchUseCase', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should close the match', async () => {
    const repo = new MongoMatchRepository();
    const match = new Match(
      'm3',
      new Team('t1', 'Team A'),
      new Team('t2', 'Team B'),
    );
    match.start();
    await repo.save(match);

    const useCase = new CloseMatchUseCase(repo);

    await useCase.execute(match.id);

    const result = await repo.getById(match.id);
    expect(result?.status).toBe(MatchStatus.FINISHED);
  });
});
