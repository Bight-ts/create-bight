import { describe, expect, it } from "vitest";
import { parseFlags } from "../src/flags.js";

describe("parseFlags", () => {
  it("parses major scaffold flags", () => {
    const result = parseFlags([
      "--dir=my-bot",
      "--storage=prisma",
      "--sql-provider=postgres",
      "--command-mode=guild",
      "--cooldowns=false",
      "--extras=validation,dev-commands",
      "--yes",
    ]);

    expect(result).toEqual({
      dir: "my-bot",
      storage: "prisma",
      sqlProvider: "postgres",
      commandMode: "guild",
      cooldowns: false,
      extras: ["validation", "dev-commands"],
      yes: true,
    });
  });
});
