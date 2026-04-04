import { createDrizzleStorageAdapter } from "@bight-ts/storage-drizzle";
import { db, tables } from "~/db/client.js";

export function createStorageAdapter() {
  return createDrizzleStorageAdapter({
    db,
    tables,
  });
}
