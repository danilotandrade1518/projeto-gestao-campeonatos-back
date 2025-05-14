import { SqsQueueAdapter } from '../../../adapter/sqs/SqsQueueAdapter';
import { GetBestGoalkeeperQueryHandler } from '../../../application/queries/GetBestGoalkeeperQueryHandler';
import { GetClassificationQueryHandler } from '../../../application/queries/GetClassificationQueryHandler';
import { GetMatchDetailsQueryHandler } from '../../../application/queries/GetMatchDetailsQueryHandler';
import { GetMatchesTableQueryHandler } from '../../../application/queries/GetMatchesTableQueryHandler';
import { GetMatchSnapshotQueryHandler } from '../../../application/queries/GetMatchSnapshotQueryHandler';
import { GetPublicMatchDetailsQueryHandler } from '../../../application/queries/GetPublicMatchDetailsQueryHandler';
import { GetTopScorersQueryHandler } from '../../../application/queries/GetTopScorersQueryHandler';
import { CloseMatchUseCase } from '../../../application/usecases/CloseMatchUseCase';
import { RegisterMatchEventUseCase } from '../../../application/usecases/RegisterMatchEventUseCase';
import { StartMatchUseCase } from '../../../application/usecases/StartMatchUseCase';
import { StartSecondHalfUseCase } from '../../../application/usecases/StartSecondHalfUseCase';
import { SyncOfflineDataUseCase } from '../../../application/usecases/SyncOfflineDataUseCase';
import { UpdateStatisticsUseCase } from '../../../application/usecases/UpdateStatisticsUseCase';
import { VoteCraqueDaPartidaUseCase } from '../../../application/usecases/VoteCraqueDaPartidaUseCase';
import { MongoBestGoalkeeperDAO } from '../../../infrastructure/dao/MongoBestGoalkeeperDAO';
import { MongoClassificationDAO } from '../../../infrastructure/dao/MongoClassificationDAO';
import { MongoMatchDetailsDAO } from '../../../infrastructure/dao/MongoMatchDetailsDAO';
import { MongoMatchesTableDAO } from '../../../infrastructure/dao/MongoMatchesTableDAO';
import { MongoTopScorerDAO } from '../../../infrastructure/dao/MongoTopScorerDAO';
import { MongoMatchEventRepository } from '../../../infrastructure/persistence/MongoMatchEventRepository';
import { MongoMatchRepository } from '../../../infrastructure/persistence/MongoMatchRepository';
import { MongoVoteRepository } from '../../../infrastructure/persistence/MongoVoteRepository';
import { InfraMessageQueuePublisher } from '../../../infrastructure/queue/InfraMessageQueuePublisher';

const DepMongoMatchRepository = new MongoMatchRepository();
const DepMongoMatchEventRepository = new MongoMatchEventRepository();
const DepMongoVoteRepository = new MongoVoteRepository();
const DepMongoMatchesTableDAO = new MongoMatchesTableDAO();
const DepMongoClassificationDAO = new MongoClassificationDAO();
const DepMongoTopScorerDAO = new MongoTopScorerDAO();
const DepMongoBestGoalkeeperDAO = new MongoBestGoalkeeperDAO();
const DepMongoMatchDetailsDAO = new MongoMatchDetailsDAO();

const DepUpdateStatsInfraMessageQueuePublisher = new InfraMessageQueuePublisher(
  new SqsQueueAdapter(),
  process.env.UPDATE_STATS_QUEUE_URL!,
);

export const getDependencies = () => ({
  usecases: {
    CloseMatchUseCase: new CloseMatchUseCase(
      DepMongoMatchRepository,
      DepMongoMatchesTableDAO,
      DepUpdateStatsInfraMessageQueuePublisher,
    ),
    RegisterMatchEventUseCase: new RegisterMatchEventUseCase(
      DepMongoMatchRepository,
      DepMongoMatchesTableDAO,
      DepUpdateStatsInfraMessageQueuePublisher,
    ),
    StartMatchUseCase: new StartMatchUseCase(DepMongoMatchRepository),
    StartSecondHalfUseCase: new StartSecondHalfUseCase(DepMongoMatchRepository),
    SyncOfflineDataUseCase: new SyncOfflineDataUseCase(
      DepMongoMatchRepository,
      DepMongoMatchEventRepository,
      DepUpdateStatsInfraMessageQueuePublisher,
    ),
    UpdateStatisticsUseCase: new UpdateStatisticsUseCase(
      DepMongoMatchRepository,
      DepMongoClassificationDAO,
      DepMongoTopScorerDAO,
      DepMongoBestGoalkeeperDAO,
    ),
    VoteCraqueDaPartidaUseCase: new VoteCraqueDaPartidaUseCase(
      DepMongoMatchRepository,
      DepMongoVoteRepository,
    ),
  },
  queryHandlers: {
    GetBestGoalkeeperQueryHandler: new GetBestGoalkeeperQueryHandler(
      DepMongoBestGoalkeeperDAO,
    ),
    GetClassificationQueryHandler: new GetClassificationQueryHandler(
      DepMongoClassificationDAO,
    ),
    GetMatchesTableQueryHandler: new GetMatchesTableQueryHandler(
      DepMongoMatchesTableDAO,
    ),
    GetMatchSnapshotQueryHandler: new GetMatchSnapshotQueryHandler(
      DepMongoMatchRepository,
      DepMongoMatchEventRepository,
    ),
    GetPublicMatchDetailsQueryHandler: new GetPublicMatchDetailsQueryHandler(
      DepMongoMatchDetailsDAO,
    ),
    GetMatchDetailsQueryHandler: new GetMatchDetailsQueryHandler(
      DepMongoMatchRepository,
      DepMongoMatchEventRepository,
    ),
    GetTopScorersQueryHandler: new GetTopScorersQueryHandler(
      DepMongoTopScorerDAO,
    ),
  },
});
