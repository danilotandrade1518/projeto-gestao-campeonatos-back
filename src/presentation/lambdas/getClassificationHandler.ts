import { GetClassificationQueryHandler } from '../../application/queries/GetClassificationQueryHandler';
import { MongoClassificationDAO } from '../../infrastructure/dao/MongoClassificationDAO';

export const handler = async () => {
  const query = new GetClassificationQueryHandler(new MongoClassificationDAO());
  const result = await query.execute();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
