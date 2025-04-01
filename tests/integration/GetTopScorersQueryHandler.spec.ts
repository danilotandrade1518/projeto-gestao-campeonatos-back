import { GetTopScorersQueryHandler } from '../../src/application/queries/GetTopScorersQueryHandler';
import { MongoTopScorerDAO } from '../../src/infrastructure/dao/MongoTopScorerDAO';
import { client, db } from '../../src/shared/config';

describe('GetTopScorersQueryHandler', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should return the top scorers', async () => {
    await db.collection('top_scorers').insertOne({
      playerId: 'p1',
      playerName: 'Player 1',
      teamId: 't1',
      goals: 5,
    });

    const handler = new GetTopScorersQueryHandler(new MongoTopScorerDAO());
    const result = await handler.execute();

    expect(result).toHaveLength(1);
    expect(result[0].playerId).toBe('p1');
  });
});
