import { VoteCraqueDaPartidaUseCase } from '../../application/usecases/VoteCraqueDaPartidaUseCase';
import { MongoMatchRepository } from '../../infrastructure/persistence/MongoMatchRepository';
import { MongoVoteRepository } from '../../infrastructure/persistence/MongoVoteRepository';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const matchId = event.pathParameters.matchId;
    const voterId = body.voterId;
    const votedPlayerId = body.votedPlayerId;

    const matchRepo = new MongoMatchRepository();
    const voteRepo = new MongoVoteRepository();
    const useCase = new VoteCraqueDaPartidaUseCase(matchRepo, voteRepo);

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
