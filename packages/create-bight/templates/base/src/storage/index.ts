import { createStorage } from "@bight-ts/core";
import { createStorageAdapter } from "./adapter.js";

export const storage = createStorage(createStorageAdapter());
