import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/client.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "data/drizzle.sqlite",
  },
});
