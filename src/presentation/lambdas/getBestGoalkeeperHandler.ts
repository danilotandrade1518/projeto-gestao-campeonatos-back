import { getDependencies } from './core/getDependencies';

export const handler = async () => {
  const query = getDependencies().queryHandlers.GetBestGoalkeeperQueryHandler;
  const result = await query.execute();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
