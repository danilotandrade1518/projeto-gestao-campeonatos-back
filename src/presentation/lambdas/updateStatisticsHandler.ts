import { getDependencies } from './core/getDependencies';

export const handler = async (event: any) => {
  try {
    const useCase = getDependencies().usecases.UpdateStatisticsUseCase;

    for (const record of event.Records) {
      const { matchId } = JSON.parse(record.body);
      await useCase.execute(matchId);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Statistics updated successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
