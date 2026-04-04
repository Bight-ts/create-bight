import { storage } from "~/storage/index.js";

/**
 * App-owned services live here.
 *
 * Add external clients, reusable helpers, and integrations here first.
 * Lightweight official batteries like `@bight-ts/toolkit` can also be wired here.
 * If an integration needs lifecycle hooks around startup, reach for
 * `src/plugins/` next.
 */
export function createAppServices() {
  return {
    storage,
  };
}

export type AppServices = ReturnType<typeof createAppServices>;
