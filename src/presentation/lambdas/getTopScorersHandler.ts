import { GetTopScorersQueryHandler } from '../../application/queries/GetTopScorersQueryHandler';
import { MongoTopScorerDAO } from '../../infrastructure/dao/MongoTopScorerDAO';

export const handler = async () => {
  const query = new GetTopScorersQueryHandler(new MongoTopScorerDAO());
  const result = await query.execute();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
