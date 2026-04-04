import { createMongooseStorageSchemas } from "@bight-ts/storage-mongoose";
import mongoose from "mongoose";
import { env } from "~/config/env.js";

const schemas = createMongooseStorageSchemas();

export const GlobalConfigModel =
  mongoose.models.GlobalConfig ?? mongoose.model("GlobalConfig", schemas.globalConfigSchema);
export const GuildConfigModel =
  mongoose.models.GuildConfig ?? mongoose.model("GuildConfig", schemas.guildConfigSchema);

let connectionPromise: Promise<typeof mongoose> | undefined;

export async function connectToDatabase() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/discord-bot");
  }

  return connectionPromise;
}
