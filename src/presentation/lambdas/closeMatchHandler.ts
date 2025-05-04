import { getDependencies } from './core/getDependencies';

export const handler = async (event: any) => {
  try {
    const useCase = getDependencies().usecases.CloseMatchUseCase;

    const matchId = event.pathParameters.matchId;
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
