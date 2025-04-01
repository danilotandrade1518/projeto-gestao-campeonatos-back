import { CloseMatchUseCase } from '../../application/usecases/CloseMatchUseCase';
import { MongoMatchRepository } from '../../infrastructure/persistence/MongoMatchRepository';

export const handler = async (event: any) => {
  try {
    const matchId = event.pathParameters.matchId;

    const useCase = new CloseMatchUseCase(new MongoMatchRepository());
    await useCase.execute(matchId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Match closed successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
