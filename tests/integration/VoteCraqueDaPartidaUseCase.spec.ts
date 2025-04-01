import { Match } from '../../src/domain/match/Match';
import { Team } from '../../src/domain/match/Team';
import { db } from '../../src/shared/config';
import { VoteCraqueDaPartidaUseCase } from './../../src/application/usecases/VoteCraqueDaPartidaUseCase';
import { MongoMatchRepository } from './../../src/infrastructure/persistence/MongoMatchRepository';
import { MongoVoteRepository } from './../../src/infrastructure/persistence/MongoVoteRepository';

describe('VoteCraqueDaPartidaUseCase', () => {
  beforeAll(async () => {
    await db.dropDatabase();
  });

  it('should register a vote', async () => {
    const matchRepo = new MongoMatchRepository();
    const voteRepo = new MongoVoteRepository();
    const match = new Match(
      'm4',
      new Team('t1', 'Team A'),
      new Team('t2', 'Team B'),
    );
    match.start();
    await matchRepo.save(match);

    const useCase = new VoteCraqueDaPartidaUseCase(matchRepo, voteRepo);

    await useCase.execute({
      matchId: match.id,
      voterId: 'voter1',
      votedPlayerId: 'player1',
    });

    const exists = await voteRepo.hasVoted(match.id, 'voter1');
    expect(exists).toBe(true);
  });
});
