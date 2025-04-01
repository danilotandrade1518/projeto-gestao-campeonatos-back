import { GetClassificationQueryHandler } from '../../src/application/queries/GetClassificationQueryHandler';
import { MongoClassificationDAO } from '../../src/infrastructure/dao/MongoClassificationDAO';
import { db } from '../../src/shared/config';

describe('GetClassificationQueryHandler', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  it('should return the classification', async () => {
    await db.collection('classification').insertOne({
      teamId: 't1',
      teamName: 'Team A',
      points: 6,
      wins: 3,
      draws: 0,
      losses: 1,
      goalsScored: 10,
      goalsConceded: 5,
      goalDifference: 5,
      yellowCards: 2,
      redCards: 0,
    });

    const handler = new GetClassificationQueryHandler(
      new MongoClassificationDAO(),
    );
    const result = await handler.execute();

    expect(result).toHaveLength(1);
    expect(result[0].teamId).toBe('t1');
  });
});
