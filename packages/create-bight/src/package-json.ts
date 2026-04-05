import type { CliOptions } from "./types.js";
import { getDependencies, getDevDependencies } from "./deps.js";

export function buildPackageJson(options: CliOptions) {
  const scripts: Record<string, string> = {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json && tsc-alias -p tsconfig.json",
    "start": "node dist/src/index.js",
    "start:with-deploy": "tsx scripts/deploy-commands.ts && tsc -p tsconfig.json && tsc-alias -p tsconfig.json && node dist/src/index.js",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write .",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "deploy:commands": "tsx scripts/deploy-commands.ts",
    "deploy:commands:global": "tsx scripts/deploy-commands.ts --mode=global",
    "deploy:commands:guild": "tsx scripts/deploy-commands.ts --mode=guild",
    "test": "vitest run",
  };

  if (options.storage === "drizzle") {
    scripts["db:generate"] = "drizzle-kit generate";
    scripts["db:migrate"] = "drizzle-kit migrate";
    scripts["db:studio"] = "drizzle-kit studio";
  }

  if (options.storage === "prisma") {
    scripts["prisma:generate"] = "prisma generate";
    scripts["prisma:migrate:dev"] = "prisma migrate dev";
    scripts["prisma:migrate:deploy"] = "prisma migrate deploy";
  }

  return {
    name: options.packageName,
    version: "0.1.0",
    private: true,
    type: "module",
    engines: {
      node: ">=20.0.0",
    },
    scripts,
    dependencies: sortObject(getDependencies(options)),
    devDependencies: sortObject(getDevDependencies(options)),
  };
}

function sortObject(input: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(input).sort(([left], [right]) => left.localeCompare(right)),
  );
}
