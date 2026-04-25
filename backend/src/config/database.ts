import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

let memoryServer: MongoMemoryServer | null = null;

async function connectWithUri(uri: string): Promise<void> {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
}

export function isDatabaseReady(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function connectDatabase(): Promise<void> {
  try {
    await connectWithUri(env.MONGODB_URI);
    return;
  } catch (error) {
    if (!env.allowInMemoryDb) {
      throw error;
    }

    // eslint-disable-next-line no-console
    console.warn("Primary MongoDB unavailable. Switching to in-memory MongoDB.");
    memoryServer = await MongoMemoryServer.create();
    await connectWithUri(memoryServer.getUri());
    // eslint-disable-next-line no-console
    console.log("Connected to in-memory MongoDB fallback.");
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
