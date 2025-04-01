import { MatchEventType } from '../../src/domain/events/MatchEvent';
import { Match } from '../../src/domain/match/Match';
import { Team } from '../../src/domain/match/Team';
import { client, db } from '../../src/shared/config';
import { SyncOfflineDataUseCase } from './../../src/application/usecases/SyncOfflineDataUseCase';
import { MongoMatchEventRepository } from './../../src/infrastructure/persistence/MongoMatchEventRepository';
import { MongoMatchRepository } from './../../src/infrastructure/persistence/MongoMatchRepository';

describe('SyncOfflineDataUseCase', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should sync offline events', async () => {
    const matchRepo = new MongoMatchRepository();
    const eventRepo = new MongoMatchEventRepository();
    const match = new Match(
      'm5',
      new Team('t1', 'Team A'),
      new Team('t2', 'Team B'),
    );
    match.start();
    await matchRepo.save(match);

    const useCase = new SyncOfflineDataUseCase(matchRepo, eventRepo);

    await useCase.execute({
      matchId: match.id,
      events: [
        {
          id: 'e1',
          type: MatchEventType.GOAL,
          teamId: 't1',
          timestamp: new Date().toISOString(),
          period: 'FIRST_HALF',
          minute: 5,
          data: { playerId: 'p1' },
        },
      ],
    });

    const matchUpdated = await matchRepo.getById(match.id);
    expect(matchUpdated?.getEvents()).toHaveLength(1);
  });
});
