import { MongoMemoryServer } from 'mongodb-memory-server';

export default async () => {
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  process.env.MONGO_URI = mongoUri;

  return {
    rootDir: '.',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testEnvironment: 'node',
    preset: 'ts-jest',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    testRegex: '.*\\.spec\\.ts$',
    testTimeout: 20000,
  };
};
