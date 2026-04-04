import { KeyvStorageAdapter } from "@bight-ts/storage-keyv";
import { env } from "~/config/env.js";

export function createStorageAdapter() {
  return new KeyvStorageAdapter({
    url: env.KEYV_URL,
  });
}
