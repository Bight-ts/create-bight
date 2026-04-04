import { env } from "~/config/env.js";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";

export const globalConfigs = sqliteTable("global_configs", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const guildConfigs = sqliteTable("guild_configs", {
  guildId: text("guild_id").primaryKey(),
  value: text("value").notNull(),
});

export const db = drizzleSqlite(env.DATABASE_URL || "data/drizzle.sqlite");
