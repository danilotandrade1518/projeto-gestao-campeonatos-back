import { GetBestGoalkeeperQueryHandler } from '../../application/queries/GetBestGoalkeeperQueryHandler';
import { MongoBestGoalkeeperDAO } from '../../infrastructure/dao/MongoBestGoalkeeperDAO';

export const handler = async () => {
  const query = new GetBestGoalkeeperQueryHandler(new MongoBestGoalkeeperDAO());
  const result = await query.execute();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
