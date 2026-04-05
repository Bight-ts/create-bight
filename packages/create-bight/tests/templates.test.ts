import { describe, expect, it } from "vitest";
import { getScaffoldTemplate } from "../src/templates.js";

describe("getScaffoldTemplate", () => {
  it("returns the requested template", () => {
    const result = getScaffoldTemplate("hybrid");

    expect(result.value).toBe("hybrid");
    expect(result.defaults.extras).toContain("message-commands");
    expect(result.defaults.extras).toContain("prefix-commands");
  });

  it("falls back to starter", () => {
    const result = getScaffoldTemplate(undefined);

    expect(result.value).toBe("starter");
    expect(result.defaults.storage).toBe("json");
  });
});
