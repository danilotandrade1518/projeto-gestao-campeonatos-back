import { getDependencies } from './core/getDependencies';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const useCase = getDependencies().usecases.SyncOfflineDataUseCase;

    await useCase.execute({
      matchId: event.pathParameters.matchId,
      events: body.events,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Offline data synchronized successfully',
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
