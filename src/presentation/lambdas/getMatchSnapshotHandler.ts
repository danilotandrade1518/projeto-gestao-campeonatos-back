import { GetMatchSnapshotQueryHandler } from '../../application/queries/GetMatchSnapshotQueryHandler';
import { MongoMatchDAO } from '../../infrastructure/dao/MongoMatchDAO';

export const handler = async (event: any) => {
  try {
    const matchId = event.pathParameters.matchId;
    const dao = new MongoMatchDAO();
    const queryHandler = new GetMatchSnapshotQueryHandler(dao);

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
