import { createPrismaStorageAdapter } from "@bight-ts/storage-prisma";
import { prisma } from "~/db/client.js";

export function createStorageAdapter() {
  return createPrismaStorageAdapter({
    globalConfigs: prisma.globalConfig,
    guildConfigs: prisma.guildConfig,
  });
}
