import { getDependencies } from './core/getDependencies';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const useCase = getDependencies().usecases.VoteCraqueDaPartidaUseCase;

    const matchId = event.pathParameters.matchId;
    const voterId = body.voterId;
    const votedPlayerId = body.votedPlayerId;

    await useCase.execute({
      matchId,
      voterId,
      votedPlayerId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Vote registered successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
