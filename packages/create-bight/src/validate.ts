import { resolve } from "node:path";
import type { CliOptions } from "./types.js";
import { scaffoldTemplates } from "./templates.js";
import { isDirectoryEmpty, pathExists } from "./utils.js";

export async function validateOptions(options: CliOptions): Promise<void> {
  if (!scaffoldTemplates.some((template) => template.value === options.template)) {
    throw new Error(
      "--template must be one of: starter, minimal, hybrid, ops-ready.",
    );
  }

  if (!["pnpm", "npm", "yarn", "bun"].includes(options.packageManager)) {
    throw new Error(
      "--package-manager must be one of: pnpm, npm, yarn, bun.",
    );
  }

  if (
    (options.storage === "drizzle" || options.storage === "prisma") &&
    !options.sqlProvider
  ) {
    throw new Error("SQL storage requires --sql-provider.");
  }

  if (options.storage !== "keyv" && options.keyvStore) {
    throw new Error("--keyv-store can only be used with --storage=keyv.");
  }

  if (options.storage !== "drizzle" && options.storage !== "prisma" && options.sqlProvider) {
    throw new Error("--sql-provider can only be used with SQL storage.");
  }

  const targetDir = resolve(process.cwd(), options.dir);
  if (await pathExists(targetDir)) {
    const empty = await isDirectoryEmpty(targetDir);
    if (!empty) {
      throw new Error(`Target directory is not empty: ${targetDir}`);
    }
  }
}
