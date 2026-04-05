import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { validateOptions } from "../src/validate.js";

describe("validateOptions", () => {
  it("rejects incompatible sql flags", async () => {
    await expect(
      validateOptions({
        dir: "tmp-bot",
        name: "Tmp Bot",
        packageName: "tmp-bot",
        botName: "Tmp Bot",
        template: "starter",
        storage: "json",
        sqlProvider: "postgres",
        commandMode: "guild",
        cooldowns: true,
        extras: [],
        packageManager: "pnpm",
        install: false,
        git: false,
        yes: true,
      }),
    ).rejects.toThrow("--sql-provider can only be used with SQL storage.");
  });

  it("rejects non-empty target directories", async () => {
    const targetDir = join(tmpdir(), `discord-bot-template-${Date.now()}`);
    await mkdir(targetDir, { recursive: true });
    await writeFile(join(targetDir, "marker.txt"), "occupied", "utf8");

    await expect(
      validateOptions({
        dir: targetDir,
        name: "Tmp Bot",
        packageName: "tmp-bot",
        botName: "Tmp Bot",
        template: "starter",
        storage: "json",
        commandMode: "guild",
        cooldowns: true,
        extras: [],
        packageManager: "pnpm",
        install: false,
        git: false,
        yes: true,
      }),
    ).rejects.toThrow("Target directory is not empty");
  });

  it("rejects unknown templates", async () => {
    await expect(
      validateOptions({
        dir: "tmp-bot",
        name: "Tmp Bot",
        packageName: "tmp-bot",
        botName: "Tmp Bot",
        template: "invalid" as never,
        storage: "json",
        commandMode: "guild",
        cooldowns: true,
        extras: [],
        packageManager: "pnpm",
        install: false,
        git: false,
        yes: true,
      }),
    ).rejects.toThrow("--template must be one of: starter, minimal, hybrid, ops-ready.");
  });
});
