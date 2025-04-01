import { GetMatchesTableQueryHandler } from '../../application/queries/GetMatchesTableQueryHandler';
import { MongoMatchesTableDAO } from '../../infrastructure/dao/MongoMatchesTableDAO';

export const handler = async () => {
  const query = new GetMatchesTableQueryHandler(new MongoMatchesTableDAO());
  const result = await query.execute();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
