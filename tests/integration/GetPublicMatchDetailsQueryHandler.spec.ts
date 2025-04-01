import { GetPublicMatchDetailsQueryHandler } from '../../src/application/queries/GetPublicMatchDetailsQueryHandler';
import { MongoMatchDetailsDAO } from '../../src/infrastructure/dao/MongoMatchDetailsDAO';
import { client, db } from '../../src/shared/config';

describe('GetPublicMatchDetailsQueryHandler', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should return public match details', async () => {
    await db.collection('matches').insertOne({
      id: 'm1',
      teamA: 'Team A',
      teamB: 'Team B',
      events: [],
    });

    const handler = new GetPublicMatchDetailsQueryHandler(
      new MongoMatchDetailsDAO(),
    );
    const result = await handler.execute('m1');

    expect(result.matchId).toBe('m1');
  });
});
