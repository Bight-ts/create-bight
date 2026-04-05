import { describe, expect, it } from "vitest";
import {
  detectPackageManager,
  formatInstallCommand,
  formatRunCommand,
} from "../src/package-manager.js";

describe("package manager helpers", () => {
  it("detects package managers from user agent strings", () => {
    expect(detectPackageManager("bun/1.2.0")).toBe("bun");
    expect(detectPackageManager("npm/11.0.0 node/v24.0.0")).toBe("npm");
    expect(detectPackageManager("pnpm/10.0.0 npm/? node/v24.0.0")).toBe("pnpm");
    expect(detectPackageManager("yarn/4.9.0 npm/? node/v24.0.0")).toBe("yarn");
  });

  it("formats script and install commands for each package manager", () => {
    expect(formatInstallCommand("pnpm")).toBe("pnpm install");
    expect(formatInstallCommand("bun")).toBe("bun install");
    expect(formatRunCommand("npm", "start:with-deploy")).toBe(
      "npm run start:with-deploy",
    );
    expect(formatRunCommand("bun", "start:with-deploy")).toBe(
      "bun run start:with-deploy",
    );
    expect(formatRunCommand("pnpm", "start:with-deploy")).toBe(
      "pnpm start:with-deploy",
    );
    expect(formatRunCommand("yarn", "start:with-deploy")).toBe(
      "yarn start:with-deploy",
    );
  });
});
