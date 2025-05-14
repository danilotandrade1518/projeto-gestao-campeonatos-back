import { getDependencies } from './core/getDependencies';

export const handler = async (event: any) => {
  const matchId = event.pathParameters.matchId;

  const query = getDependencies().queryHandlers.GetMatchDetailsQueryHandler;
  const result = await query.execute(matchId);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
