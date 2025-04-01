import { GetPublicMatchDetailsQueryHandler } from '../../application/queries/GetPublicMatchDetailsQueryHandler';
import { MongoMatchDetailsDAO } from '../../infrastructure/dao/MongoMatchDetailsDAO';

export const handler = async (event: any) => {
  const matchId = event.pathParameters.matchId;

  const query = new GetPublicMatchDetailsQueryHandler(
    new MongoMatchDetailsDAO(),
  );
  const result = await query.execute(matchId);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
