import type { CliOptions } from "./types.js";

const BIGHT_CORE_VERSION = "^0.1.0";
const BIGHT_EXTRAS_VERSION = "^0.2.0";

export function getDependencies(options: CliOptions): Record<string, string> {
  const dependencies: Record<string, string> = {
    "@t3-oss/env-core": "^0.13.8",
    "@bight-ts/core": resolveBightPackageSpec(),
    "discord.js": "^14.21.0",
    "dotenv": "^17.2.1",
    "zod": "^4.1.5",
  };

  if (options.storage === "json") {
    dependencies["@bight-ts/storage-json"] = resolvePackageSpec(
      "BIGHT_STORAGE_JSON_PACKAGE_SPEC",
    );
  }

  if (options.storage === "keyv") {
    dependencies["@bight-ts/storage-keyv"] = resolvePackageSpec(
      "BIGHT_STORAGE_KEYV_PACKAGE_SPEC",
    );
    dependencies["keyv"] = "^5.3.4";

    if (options.keyvStore === "sqlite") {
      dependencies["@keyv/sqlite"] = "^4.0.8";
    }

    if (options.keyvStore === "postgres") {
      dependencies["@keyv/postgres"] = "^2.2.3";
    }

    if (options.keyvStore === "mysql") {
      dependencies["@keyv/mysql"] = "^2.1.10";
    }

    if (options.keyvStore === "redis") {
      dependencies["@keyv/redis"] = "^4.6.0";
    }
  }

  if (options.storage === "drizzle") {
    dependencies["@bight-ts/storage-drizzle"] = resolvePackageSpec(
      "BIGHT_STORAGE_DRIZZLE_PACKAGE_SPEC",
    );
    dependencies["drizzle-orm"] = "^0.44.5";
    if (options.sqlProvider === "sqlite") {
      dependencies["better-sqlite3"] = "^12.2.0";
    }
    if (options.sqlProvider === "postgres") {
      dependencies["postgres"] = "^3.4.7";
    }
    if (options.sqlProvider === "mysql") {
      dependencies["mysql2"] = "^3.15.0";
    }
  }

  if (options.storage === "prisma") {
    dependencies["@bight-ts/storage-prisma"] = resolvePackageSpec(
      "BIGHT_STORAGE_PRISMA_PACKAGE_SPEC",
    );
    dependencies["@prisma/client"] = "^6.7.0";
  }

  if (options.storage === "mongoose") {
    dependencies["@bight-ts/storage-mongoose"] = resolvePackageSpec(
      "BIGHT_STORAGE_MONGOOSE_PACKAGE_SPEC",
    );
    dependencies["mongoose"] = "^8.18.0";
  }

  if (options.extras.includes("scheduler")) {
    dependencies["@bight-ts/plugin-scheduler"] = resolvePackageSpec(
      "BIGHT_PLUGIN_SCHEDULER_PACKAGE_SPEC",
    );
  }

  if (options.extras.includes("devtools")) {
    dependencies["@bight-ts/plugin-devtools"] = resolvePackageSpec(
      "BIGHT_PLUGIN_DEVTOOLS_PACKAGE_SPEC",
    );
  }

  if (options.extras.includes("i18n")) {
    dependencies["@bight-ts/i18n"] = resolvePackageSpec(
      "BIGHT_I18N_PACKAGE_SPEC",
    );
  }

  if (options.extras.includes("settings")) {
    dependencies["@bight-ts/settings"] = resolvePackageSpec(
      "BIGHT_SETTINGS_PACKAGE_SPEC",
    );
  }

  if (options.extras.includes("message-commands")) {
    dependencies["@bight-ts/plugin-message-commands"] = resolvePackageSpec(
      "BIGHT_PLUGIN_MESSAGE_COMMANDS_PACKAGE_SPEC",
    );
  }

  if (options.extras.includes("prefix-commands")) {
    dependencies["@bight-ts/plugin-prefix-commands"] = resolvePackageSpec(
      "BIGHT_PLUGIN_PREFIX_COMMANDS_PACKAGE_SPEC",
    );
  }

  if (options.extras.includes("startup-checks")) {
    dependencies["@bight-ts/plugin-ops"] = resolvePackageSpec(
      "BIGHT_PLUGIN_OPS_PACKAGE_SPEC",
    );
  }

  if (usesToolkitExtras(options)) {
    dependencies["@bight-ts/toolkit"] = resolvePackageSpec(
      "BIGHT_TOOLKIT_PACKAGE_SPEC",
    );
  }

  return dependencies;
}

export function getDevDependencies(options: CliOptions): Record<string, string> {
  const devDependencies: Record<string, string> = {
    "@types/node": "^24.3.0",
    "eslint": "^9.35.0",
    "prettier": "^3.6.2",
    "tsc-alias": "^1.8.16",
    "tsconfig-paths": "^4.2.0",
    "tsx": "^4.20.5",
    "typescript": "^5.9.2",
    "typescript-eslint": "^8.42.0",
    "vitest": "^3.2.4",
  };

  if (options.storage === "drizzle") {
    devDependencies["drizzle-kit"] = "^0.31.4";
  }

  if (options.storage === "prisma") {
    devDependencies["prisma"] = "^6.7.0";
  }

  return devDependencies;
}

function resolveBightPackageSpec() {
  return process.env.BIGHT_PACKAGE_SPEC ?? BIGHT_CORE_VERSION;
}

function resolvePackageSpec(envVar: string) {
  return process.env[envVar] ?? BIGHT_EXTRAS_VERSION;
}

function usesToolkitExtras(options: CliOptions) {
  return options.extras.some((extra) =>
    extra === "cache" || extra === "time" || extra === "validation"
  );
}
