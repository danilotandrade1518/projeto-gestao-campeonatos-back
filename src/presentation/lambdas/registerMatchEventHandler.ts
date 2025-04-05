import { RegisterMatchEventUseCase } from '../../application/usecases/RegisterMatchEventUseCase';
import { MongoMatchesTableDAO } from '../../infrastructure/dao/MongoMatchesTableDAO';
import { MongoMatchRepository } from '../../infrastructure/persistence/MongoMatchRepository';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const useCase = new RegisterMatchEventUseCase(
      new MongoMatchRepository(),
      new MongoMatchesTableDAO(),
    );

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
