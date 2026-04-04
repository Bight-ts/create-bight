import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const repoRoot = process.cwd();
const cliEntry = join(repoRoot, "packages", "create-bight", "dist", "index.js");

const scenarios = [
  {
    name: "json",
    flags: [
      "--storage=json",
      "--command-mode=guild",
      "--cooldowns=true",
      "--extras=scheduler,devtools,i18n,settings,startup-checks,validation,message-commands,prefix-commands",
    ],
  },
  {
    name: "keyv-sqlite",
    flags: [
      "--storage=keyv",
      "--keyv-store=sqlite",
      "--command-mode=guild",
      "--cooldowns=true",
    ],
  },
  {
    name: "drizzle-sqlite",
    flags: [
      "--storage=drizzle",
      "--sql-provider=sqlite",
      "--command-mode=guild",
      "--cooldowns=true",
    ],
  },
  {
    name: "prisma-sqlite",
    flags: [
      "--storage=prisma",
      "--sql-provider=sqlite",
      "--command-mode=guild",
      "--cooldowns=true",
    ],
    setup(directory) {
      execFileSync("pnpm", ["prisma", "generate"], {
        cwd: directory,
        stdio: "inherit",
      });
    },
  },
  {
    name: "mongoose",
    flags: ["--storage=mongoose", "--command-mode=guild", "--cooldowns=true"],
  },
];

for (const scenario of scenarios) {
  const targetDir = resolve(tmpdir(), `bight-cli-smoke-${scenario.name}`);

  if (existsSync(targetDir)) {
    rmSync(targetDir, { recursive: true, force: true });
  }

  execFileSync(
    process.execPath,
    [
      cliEntry,
      `--dir=${targetDir}`,
      `--name=Smoke Bot ${scenario.name}`,
      `--package-name=smoke-bot-${scenario.name}`,
      `--bot-name=Smoke Bot ${scenario.name}`,
      ...scenario.flags,
      "--git=false",
      "--install=false",
      "--yes",
    ],
    {
      env: process.env,
      stdio: "inherit",
    },
  );

  applyLocalPackageOverrides(targetDir, {
    "@bight-ts/core": process.env.BIGHT_PACKAGE_SPEC,
    "@bight-ts/storage-json": process.env.BIGHT_STORAGE_JSON_PACKAGE_SPEC,
    "@bight-ts/storage-keyv": process.env.BIGHT_STORAGE_KEYV_PACKAGE_SPEC,
    "@bight-ts/storage-drizzle": process.env.BIGHT_STORAGE_DRIZZLE_PACKAGE_SPEC,
    "@bight-ts/storage-prisma": process.env.BIGHT_STORAGE_PRISMA_PACKAGE_SPEC,
    "@bight-ts/storage-mongoose":
      process.env.BIGHT_STORAGE_MONGOOSE_PACKAGE_SPEC,
    "@bight-ts/plugin-scheduler":
      process.env.BIGHT_PLUGIN_SCHEDULER_PACKAGE_SPEC,
    "@bight-ts/plugin-devtools": process.env.BIGHT_PLUGIN_DEVTOOLS_PACKAGE_SPEC,
    "@bight-ts/plugin-message-commands":
      process.env.BIGHT_PLUGIN_MESSAGE_COMMANDS_PACKAGE_SPEC,
    "@bight-ts/plugin-prefix-commands":
      process.env.BIGHT_PLUGIN_PREFIX_COMMANDS_PACKAGE_SPEC,
    "@bight-ts/plugin-ops": process.env.BIGHT_PLUGIN_OPS_PACKAGE_SPEC,
    "@bight-ts/i18n": process.env.BIGHT_I18N_PACKAGE_SPEC,
    "@bight-ts/settings": process.env.BIGHT_SETTINGS_PACKAGE_SPEC,
    "@bight-ts/toolkit": process.env.BIGHT_TOOLKIT_PACKAGE_SPEC,
  });

  execFileSync("pnpm", ["install"], { cwd: targetDir, stdio: "inherit" });
  scenario.setup?.(targetDir);
  execFileSync("pnpm", ["build"], { cwd: targetDir, stdio: "inherit" });
  execFileSync("pnpm", ["typecheck"], { cwd: targetDir, stdio: "inherit" });
}

console.log("CLI smoke matrix succeeded.");

function applyLocalPackageOverrides(directory, overrides) {
  const packageJsonPath = join(directory, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const filteredOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => Boolean(value)),
  );

  if (Object.keys(filteredOverrides).length === 0) {
    return;
  }

  packageJson.pnpm ??= {};
  packageJson.pnpm.overrides = {
    ...(packageJson.pnpm.overrides ?? {}),
    ...filteredOverrides,
  };

  writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
}
