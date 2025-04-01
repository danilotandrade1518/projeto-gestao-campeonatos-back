import { GetBestGoalkeeperQueryHandler } from '../../src/application/queries/GetBestGoalkeeperQueryHandler';
import { MongoBestGoalkeeperDAO } from '../../src/infrastructure/dao/MongoBestGoalkeeperDAO';
import { client, db } from '../../src/shared/config';

describe('GetBestGoalkeeperQueryHandler', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await client.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should return the best goalkeeper', async () => {
    await db.collection('best_goalkeepers').insertOne({
      playerId: 'gk1',
      playerName: 'Goalkeeper 1',
      teamId: 't1',
      goalsConceded: 3,
    });

    const handler = new GetBestGoalkeeperQueryHandler(
      new MongoBestGoalkeeperDAO(),
    );
    const result = await handler.execute();

    expect(result).toHaveLength(1);
    expect(result[0].playerId).toBe('gk1');
  });
});
