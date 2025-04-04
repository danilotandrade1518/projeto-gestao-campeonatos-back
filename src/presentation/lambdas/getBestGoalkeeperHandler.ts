import { GetBestGoalkeeperQueryHandler } from '../../application/queries/GetBestGoalkeeperQueryHandler';
import { MongoBestGoalkeeperDAO } from '../../infrastructure/dao/MongoBestGoalkeeperDAO';

export const handler = async () => {
  console.log('Env', process.env.MONGO_URI);

  const query = new GetBestGoalkeeperQueryHandler(new MongoBestGoalkeeperDAO());
  const result = await query.execute();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
