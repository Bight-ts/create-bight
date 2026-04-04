import { createGuildSettingsService } from "@bight-ts/settings";
import { z } from "zod";

export const guildSettings = createGuildSettingsService({
  storage,
  key: "app",
  defaults: {
    prefix: "!",
    featureFlags: {},
  },
  schema: z.object({
    prefix: z.string().trim().min(1).max(5),
    featureFlags: z.record(z.string(), z.boolean()),
  }),
});
