import { describe, expect, it } from "vitest";
import { parseFlags } from "../src/flags.js";

describe("parseFlags", () => {
  it("parses major scaffold flags", () => {
    const result = parseFlags([
      "--dir=my-bot",
      "--template=ops-ready",
      "--storage=prisma",
      "--sql-provider=postgres",
      "--command-mode=guild",
      "--package-manager=bun",
      "--cooldowns=false",
      "--extras=validation,dev-commands",
      "--yes",
    ]);

    expect(result).toEqual({
      dir: "my-bot",
      template: "ops-ready",
      storage: "prisma",
      sqlProvider: "postgres",
      commandMode: "guild",
      packageManager: "bun",
      cooldowns: false,
      extras: ["validation", "dev-commands"],
      yes: true,
    });
  });
});
