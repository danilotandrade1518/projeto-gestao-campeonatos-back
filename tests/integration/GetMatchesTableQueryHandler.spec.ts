import { faker } from '@faker-js/faker';

import { GetMatchesTableQueryHandler } from '../../src/application/queries/GetMatchesTableQueryHandler';
import { MongoMatchesTableDAO } from '../../src/infrastructure/dao/MongoMatchesTableDAO';
import { client, db } from '../../src/shared/config';

describe('GetMatchesTableQueryHandler', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should return the matches table', async () => {
    const matchId = faker.string.hexadecimal({ length: 24, prefix: '' });

    await db.collection('matches_table').insertOne({
      matchId,
      round: 1,
      teamA: 'Team A',
      teamB: 'Team B',
      date: '2025-06-01',
    });

    const handler = new GetMatchesTableQueryHandler(new MongoMatchesTableDAO());
    const result = await handler.execute();

    expect(result).toHaveLength(1);
    expect(result[0].matchId).toBe(matchId);
  });
});
