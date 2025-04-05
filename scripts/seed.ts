import 'dotenv/config';

import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  throw new Error('MONGO_URI não definida nas variáveis de ambiente');
}

const client = new MongoClient(MONGO_URI);

async function seed() {
  try {
    await client.connect();
    const db = client.db();

    const makePlayers = (names: string[]): any[] => {
      return names.map((name, index) => ({
        _id: new ObjectId(),
        name,
        position: index === 0 ? 'GOALKEEPER' : 'FIELD',
        inField: false,
        yellowCards: 0,
        redCard: false,
        timeInField: 0,
      }));
    };

    const meiaBocaJuniors = {
      _id: new ObjectId(),
      name: 'Meia Boca Juniors',
      players: makePlayers([
        'WiFi',
        'Danilo',
        'Victor',
        'Enzo',
        'Luiz Cabelo',
        'Deivison',
        'Garotim',
      ]),
    };
    const arsenalcool = {
      _id: new ObjectId(),
      name: 'Arsenalcool',
      players: makePlayers([
        'Neneca',
        'Alan',
        'Igor',
        'Rafael',
        'Covas',
        'João M',
        'Esteves',
      ]),
    };
    const unidosDoGolo = {
      _id: new ObjectId(),
      name: 'Unidos do Golo',
      players: makePlayers([
        '?',
        'Pitucha',
        'Luizin',
        'Lopes',
        'Carlin',
        'Marcos',
        'Guilherme',
      ]),
    };
    const osWolfs = {
      _id: new ObjectId(),
      name: 'Os Wolfs',
      players: makePlayers([
        'Baby Yaga',
        'Wiliam',
        'Joninha',
        'Brasil',
        'Menor',
        'Marlon',
        'Lobo',
      ]),
    };
    const tigrinhoFc = {
      _id: new ObjectId(),
      name: 'Tigrinho FC',
      players: makePlayers([
        'Pi',
        'Ian',
        'Tesouro',
        'Birico',
        'Arthur',
        'João P',
        'Thiago',
      ]),
    };

    const matches = [
      {
        _id: new ObjectId(),
        teamA: meiaBocaJuniors,
        teamB: arsenalcool,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: unidosDoGolo,
        teamB: osWolfs,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: meiaBocaJuniors,
        teamB: unidosDoGolo,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: arsenalcool,
        teamB: tigrinhoFc,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: meiaBocaJuniors,
        teamB: osWolfs,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: unidosDoGolo,
        teamB: tigrinhoFc,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: meiaBocaJuniors,
        teamB: tigrinhoFc,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: arsenalcool,
        teamB: osWolfs,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: arsenalcool,
        teamB: unidosDoGolo,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
      {
        _id: new ObjectId(),
        teamA: osWolfs,
        teamB: tigrinhoFc,
        status: 'scheduled',
        period: 'NOT_STARTED',
        events: [],
      },
    ];

    await db.collection('matches').deleteMany({});
    await db.collection('matches').insertMany(matches);
    console.log(
      '✅ Partidas inseridas no formato esperado pelo MatchAggregate',
    );

    const matchesTable = matches.map((match, index) => ({
      matchId: match._id,
      round: Math.floor(index / 2) + 1,
      teamAId: match.teamA._id,
      teamAName: match.teamA.name,
      teamBId: match.teamB._id,
      teamBName: match.teamB.name,
      status: 'scheduled',
      teamAScore: 0,
      teamBScore: 0,
      date: new Date(),
    }));

    await db.collection('matches_table').deleteMany({});
    await db.collection('matches_table').insertMany(matchesTable);
    console.log('✅ Tabela de jogos (matches_table) inserida');
  } catch (error) {
    console.error('❌ Erro ao rodar o seed', error);
  } finally {
    await client.close();
  }
}

seed();
