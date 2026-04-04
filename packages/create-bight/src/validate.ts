import { resolve } from "node:path";
import type { CliOptions } from "./types.js";
import { isDirectoryEmpty, pathExists } from "./utils.js";

export async function validateOptions(options: CliOptions): Promise<void> {
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
