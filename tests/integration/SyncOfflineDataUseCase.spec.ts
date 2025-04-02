import { faker } from '@faker-js/faker';

import { MatchEventType } from '../../src/domain/events/MatchEvent';
import { Match } from '../../src/domain/match/Match';
import { Team } from '../../src/domain/match/Team';
import { client, db } from '../../src/shared/config';
import { DefaultUpdateStatisticsService } from './../../src/application/services/DefaultUpdateStatisticsService';
import { SyncOfflineDataUseCase } from './../../src/application/usecases/SyncOfflineDataUseCase';
import { MongoBestGoalkeeperDAO } from './../../src/infrastructure/dao/MongoBestGoalkeeperDAO';
import { MongoClassificationDAO } from './../../src/infrastructure/dao/MongoClassificationDAO';
import { MongoTopScorerDAO } from './../../src/infrastructure/dao/MongoTopScorerDAO';
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
      faker.string.hexadecimal({ length: 24, prefix: '' }),
      new Team(faker.string.hexadecimal({ length: 24, prefix: '' }), 'Team A'),
      new Team(faker.string.hexadecimal({ length: 24, prefix: '' }), 'Team B'),
    );
    match.start();
    await matchRepo.save(match);

    const useCase = new SyncOfflineDataUseCase(
      matchRepo,
      eventRepo,
      new DefaultUpdateStatisticsService(
        new MongoClassificationDAO(),
        new MongoTopScorerDAO(),
        new MongoBestGoalkeeperDAO(),
      ),
    );

    await useCase.execute({
      matchId: match.id,
      events: [
        {
          id: faker.string.hexadecimal({ length: 24, prefix: '' }),
          type: MatchEventType.GOAL,
          teamId: faker.string.hexadecimal({ length: 24, prefix: '' }),
          timestamp: new Date().toISOString(),
          period: 'FIRST_HALF',
          minute: 5,
          data: {
            playerId: faker.string.hexadecimal({ length: 24, prefix: '' }),
          },
        },
      ],
    });

    const matchUpdated = await matchRepo.getById(match.id);
    expect(matchUpdated?.getEvents()).toHaveLength(1);
  });
});
