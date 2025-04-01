import { GetMatchesTableQueryHandler } from '../../src/application/queries/GetMatchesTableQueryHandler';
import { MongoMatchesTableDAO } from '../../src/infrastructure/dao/MongoMatchesTableDAO';
import { db } from '../../src/shared/config';

describe('GetMatchesTableQueryHandler', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  it('should return the matches table', async () => {
    await db.collection('matches_table').insertOne({
      matchId: 'm1',
      round: 1,
      teamA: 'Team A',
      teamB: 'Team B',
      date: '2025-06-01',
    });

    const handler = new GetMatchesTableQueryHandler(new MongoMatchesTableDAO());
    const result = await handler.execute();

    expect(result).toHaveLength(1);
    expect(result[0].matchId).toBe('m1');
  });
});
