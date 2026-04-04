import { createMongooseStorageAdapter } from "@bight-ts/storage-mongoose";
import { connectToDatabase, GuildConfigModel, GlobalConfigModel } from "~/db/client.js";

export function createStorageAdapter() {
  return createMongooseStorageAdapter({
    connect: connectToDatabase,
    globalConfigs: GlobalConfigModel,
    guildConfigs: GuildConfigModel,
  });
}
