import { MatchEvent } from '../../domain/events/MatchEvent';

export interface MatchEventRepository {
  saveMany(events: MatchEvent[]): Promise<void>;
  exists(eventId: string): Promise<boolean>;
}
