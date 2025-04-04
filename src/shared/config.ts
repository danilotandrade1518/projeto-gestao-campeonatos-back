import 'dotenv/config';
import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGO_URI as string);
export const db = client.db();
