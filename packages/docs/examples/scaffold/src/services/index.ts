import { storage } from "~/storage/index.js";

export function createAppServices() {
  return {
    storage,
  };
}

export type AppServices = ReturnType<typeof createAppServices>;
