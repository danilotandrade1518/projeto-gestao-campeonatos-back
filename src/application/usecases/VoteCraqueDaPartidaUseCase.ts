import { MatchRepository } from '../protocols/MatchRepository';
import { VoteRepository } from '../protocols/VoteRepository';

interface Input {
  matchId: string;
  voterId: string;
  votedPlayerId: string;
}

export class VoteCraqueDaPartidaUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly voteRepository: VoteRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const match = await this.matchRepository.getById(input.matchId);
    if (!match) throw new Error('Match not found');
    if (match.status !== 'IN_PROGRESS' && match.status !== 'FINISHED') {
      throw new Error('Voting is only allowed during or after the match');
    }

    const alreadyVoted = await this.voteRepository.hasVoted(
      input.matchId,
      input.voterId,
    );
    if (alreadyVoted) {
      throw new Error('You have already voted');
    }

    // Aqui poderia ter validação se o jogador votado pertence a um dos times da partida

    await this.voteRepository.save({
      matchId: input.matchId,
      voterId: input.voterId,
      votedPlayerId: input.votedPlayerId,
    });
  }
}
