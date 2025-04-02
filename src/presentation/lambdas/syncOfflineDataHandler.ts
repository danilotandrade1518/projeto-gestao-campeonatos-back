import { DefaultUpdateStatisticsService } from '../../application/services/DefaultUpdateStatisticsService';
import { SyncOfflineDataUseCase } from '../../application/usecases/SyncOfflineDataUseCase';
import { MongoBestGoalkeeperDAO } from '../../infrastructure/dao/MongoBestGoalkeeperDAO';
import { MongoClassificationDAO } from '../../infrastructure/dao/MongoClassificationDAO';
import { MongoTopScorerDAO } from '../../infrastructure/dao/MongoTopScorerDAO';
import { MongoMatchEventRepository } from '../../infrastructure/persistence/MongoMatchEventRepository';
import { MongoMatchRepository } from '../../infrastructure/persistence/MongoMatchRepository';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const useCase = new SyncOfflineDataUseCase(
      new MongoMatchRepository(),
      new MongoMatchEventRepository(),
      new DefaultUpdateStatisticsService(
        new MongoClassificationDAO(),
        new MongoTopScorerDAO(),
        new MongoBestGoalkeeperDAO(),
      ),
    );

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
