import { RegisterMatchEventUseCase } from '../../application/usecases/RegisterMatchEventUseCase';
import { MongoMatchRepository } from '../../infrastructure/persistence/MongoMatchRepository';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const repo = new MongoMatchRepository();
    const useCase = new RegisterMatchEventUseCase(repo);

    await useCase.execute({
      matchId: event.pathParameters.matchId,
      teamId: body.teamId,
      type: body.type,
      data: body.data,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event registered successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
