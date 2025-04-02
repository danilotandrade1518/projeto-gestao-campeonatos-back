import { ObjectId } from 'mongodb';

import { MatchEvent, MatchEventType } from '../../domain/events/MatchEvent';
import { MatchStatus } from '../../domain/match/Match';
import { MatchRepository } from '../protocols/MatchRepository';

interface Input {
  matchId: string;
  teamId: string;
  type: MatchEventType;
  data: any;
}

export class RegisterMatchEventUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(input: Input): Promise<void> {
    const match = await this.matchRepository.getById(input.matchId);
    if (!match) throw new Error('Match not found');
    if (match.status !== MatchStatus.IN_PROGRESS)
      throw new Error('Match is not in progress');

    const event = new MatchEvent(
      new ObjectId().toHexString(),
      input.matchId,
      input.type,
      input.teamId,
      new Date(),
      match.period,
      match.getCurrentElapsed(),
      input.data,
    );

    match.addEvent(event);

    await this.matchRepository.save(match);
  }
}
