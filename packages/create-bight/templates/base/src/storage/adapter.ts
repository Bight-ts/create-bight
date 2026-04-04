import { JsonStorageAdapter } from "@bight-ts/storage-json";
import { env } from "~/config/env.js";

export function createStorageAdapter() {
  return new JsonStorageAdapter({
    filePath: env.JSON_STORAGE_PATH,
  });
}
