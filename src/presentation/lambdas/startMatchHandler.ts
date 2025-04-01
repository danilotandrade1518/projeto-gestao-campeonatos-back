import { StartMatchUseCase } from '../../application/usecases/StartMatchUseCase';
import { MongoMatchRepository } from '../../infrastructure/persistence/MongoMatchRepository';

export const handler = async (event: any) => {
  try {
    const matchId = event.pathParameters.matchId;

    const useCase = new StartMatchUseCase(new MongoMatchRepository());
    await useCase.execute(matchId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Match started successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
