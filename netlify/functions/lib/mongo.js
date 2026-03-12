import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

if (!dbName) {
  throw new Error("Missing MONGODB_DB_NAME");
}

let client;
let clientPromise;

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
}

clientPromise = globalThis._mongoClientPromise;

export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}
