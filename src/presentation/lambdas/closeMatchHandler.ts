import { DefaultUpdateStatisticsService } from '../../application/services/DefaultUpdateStatisticsService';
import { CloseMatchUseCase } from '../../application/usecases/CloseMatchUseCase';
import { MongoBestGoalkeeperDAO } from '../../infrastructure/dao/MongoBestGoalkeeperDAO';
import { MongoClassificationDAO } from '../../infrastructure/dao/MongoClassificationDAO';
import { MongoMatchesTableDAO } from '../../infrastructure/dao/MongoMatchesTableDAO';
import { MongoTopScorerDAO } from '../../infrastructure/dao/MongoTopScorerDAO';
import { MongoMatchRepository } from '../../infrastructure/persistence/MongoMatchRepository';

export const handler = async (event: any) => {
  try {
    const matchId = event.pathParameters.matchId;

    const useCase = new CloseMatchUseCase(
      new MongoMatchRepository(),
      new MongoMatchesTableDAO(),
      new DefaultUpdateStatisticsService(
        new MongoClassificationDAO(),
        new MongoTopScorerDAO(),
        new MongoBestGoalkeeperDAO(),
      ),
    );
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
