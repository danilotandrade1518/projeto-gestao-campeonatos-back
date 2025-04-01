import { Match, MatchStatus } from '../../src/domain/match/Match';
import { Team } from '../../src/domain/match/Team';
import { db } from '../../src/shared/config';
import { StartMatchUseCase } from './../../src/application/usecases/StartMatchUseCase';
import { MongoMatchRepository } from './../../src/infrastructure/persistence/MongoMatchRepository';

describe('StartMatchUseCase', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  it('should start a match', async () => {
    const repo = new MongoMatchRepository();
    const match = new Match(
      'm1',
      new Team('t1', 'Team A'),
      new Team('t2', 'Team B'),
    );

    await repo.save(match);
    const useCase = new StartMatchUseCase(repo);

    await useCase.execute(match.id);

    const result = await repo.getById(match.id);

    expect(result?.status).toBe(MatchStatus.IN_PROGRESS);
  });
});
