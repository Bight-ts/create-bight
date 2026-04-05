import { describe, expect, it } from "vitest";
import { buildPackageJson } from "../src/package-json.js";

describe("buildPackageJson", () => {
  it("adds publishable bot scripts and selected storage deps", () => {
    const result = buildPackageJson({
      dir: "demo-bot",
      name: "Demo Bot",
      packageName: "demo-bot",
      botName: "Demo Bot",
      template: "starter",
      storage: "drizzle",
      sqlProvider: "sqlite",
      commandMode: "guild",
      cooldowns: true,
      extras: [],
      packageManager: "pnpm",
      install: false,
      git: false,
      yes: true,
    });

    expect(result.scripts["start:with-deploy"]).toContain(
      "tsx scripts/deploy-commands.ts",
    );
    expect(result.scripts["start:with-deploy"]).not.toContain("pnpm");
    expect(result.scripts["db:generate"]).toBeDefined();
    expect(result.dependencies["@bight-ts/storage-drizzle"]).toBeDefined();
    expect(result.dependencies["drizzle-orm"]).toBeDefined();
    expect(result.dependencies["better-sqlite3"]).toBeDefined();
  });

  it("adds settings and startup-checks extras as explicit package deps", () => {
    const result = buildPackageJson({
      dir: "demo-bot",
      name: "Demo Bot",
      packageName: "demo-bot",
      botName: "Demo Bot",
      template: "ops-ready",
      storage: "json",
      commandMode: "guild",
      cooldowns: true,
      extras: ["settings", "startup-checks"],
      packageManager: "pnpm",
      install: false,
      git: false,
      yes: true,
    });

    expect(result.dependencies["@bight-ts/settings"]).toBeDefined();
    expect(result.dependencies["@bight-ts/plugin-ops"]).toBeDefined();
    expect(result.dependencies["@bight-ts/plugin-ops"]).toBe("^0.2.0");
  });
});
