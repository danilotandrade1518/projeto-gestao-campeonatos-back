import { getDependencies } from './core/getDependencies';

export const handler = async (event: any) => {
  try {
    const queryHandler =
      getDependencies().queryHandlers.GetMatchSnapshotQueryHandler;

    const matchId = event.pathParameters.matchId;
    const result = await queryHandler.execute(matchId);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
