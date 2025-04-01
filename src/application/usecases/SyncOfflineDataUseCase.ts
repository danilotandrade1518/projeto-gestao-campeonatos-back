import { MatchEvent, MatchEventType } from '../../domain/events/MatchEvent';
import { MatchEventRepository } from '../protocols/MatchEventRepository';
import { MatchRepository } from '../protocols/MatchRepository';

interface SyncOfflineDataInput {
  matchId: string;
  events: Array<{
    id: string;
    type: MatchEventType;
    teamId: string;
    timestamp: string;
    period: string;
    minute: number;
    data: any;
  }>;
}

export class SyncOfflineDataUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchEventRepository: MatchEventRepository,
  ) {}

  async execute(input: SyncOfflineDataInput): Promise<void> {
    const match = await this.matchRepository.getById(input.matchId);
    if (!match) throw new Error('Match not found');

    const newEvents: MatchEvent[] = [];

    for (const rawEvent of input.events) {
      const alreadyExists = await this.matchEventRepository.exists(rawEvent.id);
      if (alreadyExists) continue;

      const event = new MatchEvent(
        rawEvent.id,
        input.matchId,
        rawEvent.type,
        rawEvent.teamId,
        new Date(rawEvent.timestamp),
        rawEvent.period,
        rawEvent.minute,
        rawEvent.data,
      );

      match.addEvent(event);
      newEvents.push(event);
    }

    if (newEvents.length > 0) {
      await this.matchEventRepository.saveMany(newEvents);
      await this.matchRepository.save(match);
    }
  }
}
