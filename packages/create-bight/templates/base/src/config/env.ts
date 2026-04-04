import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DISCORD_TOKEN: z.string().min(1),
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_TEST_GUILD_ID: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
    COMMAND_DEPLOYMENT_MODE: z.enum(["global", "guild"]).default("__COMMAND_MODE__"),
    COMMAND_COOLDOWNS_ENABLED: z
      .enum(["true", "false"])
      .default("__DEFAULT_COOLDOWNS__" as "true" | "false"),
    DEFAULT_COMMAND_COOLDOWN_SECONDS: z.coerce.number().default(3),
    STORAGE_KIND: z.string().default("__DEFAULT_STORAGE_KIND__"),
    JSON_STORAGE_PATH: z.string().default("./data/config.json"),
    KEYV_URL: z.string().optional(),
    KEYV_STORE: z.enum(["sqlite", "postgres", "mysql", "redis"]).optional(),
    DATABASE_URL: z.string().optional(),
    MONGODB_URI: z.string().optional(),
  },
  runtimeEnv: process.env,
});
