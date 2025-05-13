import { Collection, ObjectId } from 'mongodb';

import { MatchRepository } from '../../application/protocols/MatchRepository';
import { Match } from '../../domain/match/Match';
import { Player } from '../../domain/match/Player';
import { Team } from '../../domain/match/Team';
import { db } from '../../shared/config';

export class MongoMatchRepository implements MatchRepository {
  private collection: Collection;

  constructor() {
    this.collection = db.collection('matches');
  }

  async getById(matchId: string): Promise<Match | null> {
    const doc = await this.collection.findOne({ _id: new ObjectId(matchId) });
    if (!doc) return null;

    return Match.restore({
      id: doc._id.toHexString(),
      teamA: Team.restore({
        id: doc.teamA._id.toHexString(),
        name: doc.teamA.name,
        players: doc.teamA.players.map((player: any) =>
          Player.restore({
            id: player._id.toHexString(),
            name: player.name,
            position: player.position,
            inField: player.inField,
            yellowCards: player.yellowCards,
            redCard: player.redCard,
            timeInField: player.timeInField,
            entryTimeMinutes: player.entryTimeMinutes,
            lastPunishmentAt: player.lastPunishmentAt,
            lastPunishmentType: player.lastPunishmentType,
          }),
        ),
      }),
      teamB: Team.restore({
        id: doc.teamB._id.toHexString(),
        name: doc.teamB.name,
        players: doc.teamA.players.map((player: any) =>
          Player.restore({
            id: player._id.toHexString(),
            name: player.name,
            position: player.position,
            inField: player.inField,
            yellowCards: player.yellowCards,
            redCard: player.redCard,
            timeInField: player.timeInField,
            entryTimeMinutes: player.entryTimeMinutes,
            lastPunishmentAt: player.lastPunishmentAt,
            lastPunishmentType: player.lastPunishmentType,
          }),
        ),
      }),
      status: doc.status,
      period: doc.period,
      firstHalfElapsed: doc.firstHalfElapsed || 0,
      secondHalfElapsed: doc.secondHalfElapsed || 0,
      currentPeriodStartTime: doc.currentPeriodStartTime
        ? new Date(doc.currentPeriodStartTime)
        : null,
      events:
        doc.events.map((e: any) => ({
          id: e._id.toHexString(),
          ...e,
        })) || [],
    });
  }

  async save(match: Match): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(match.id) },
      {
        $set: {
          teamA: {
            _id: new ObjectId(match.teamA.id),
            name: match.teamA.name,
            players: match.teamA.players.map((player) =>
              this.mapPlayer(player),
            ),
          },
          teamB: {
            _id: new ObjectId(match.teamB.id),
            name: match.teamB.name,
            players: match.teamA.players.map((player) =>
              this.mapPlayer(player),
            ),
          },
          status: match.status,
          period: match.period,
          firstHalfElapsed: match.firstHalfElapsed || 0,
          secondHalfElapsed: match.secondHalfElapsed || 0,
          currentPeriodStartTime: match.currentPeriodStartTime
            ? new Date(match.currentPeriodStartTime)
            : null,
          events:
            match.events.map((e) => ({
              _id: new ObjectId(e.id),
              ...e,
            })) || [],
        },
      },
      { upsert: true },
    );
  }

  private mapPlayer(player: Player) {
    return {
      _id: new ObjectId(player.id),
      name: player.name,
      position: player.position,
      inField: player.inField,
      yellowCards: player.yellowCards,
      redCard: player.redCard,
      timeInField: player.timeInField,
      entryTimeMinutes: player.entryTimeMinutes,
      lastPunishmentAt: player.lastPunishmentAt,
      lastPunishmentType: player.lastPunishmentType,
    };
  }
}
