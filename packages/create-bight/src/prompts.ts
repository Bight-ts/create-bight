import { cancel, confirm, intro, isCancel, multiselect, outro, select, text } from "@clack/prompts";
import process from "node:process";
import type { CliOptions, CommandMode, ExtraName, KeyvStore, SqlProvider, StorageKind } from "./types.js";

type PartialFlags = Partial<CliOptions>;

export async function resolveOptions(flags: PartialFlags): Promise<CliOptions> {
  const defaults = getDefaults();

  if (!flags.yes) {
    intro("Bight");
  }

  const dir = await resolveValue(
    flags.dir,
    defaults.dir,
    flags.yes,
    () =>
      text({
        message: "Project directory",
        initialValue: defaults.dir,
        placeholder: "my-discord-bot",
      }),
  );

  const name = await resolveValue(
    flags.name,
    dir,
    flags.yes,
    () =>
      text({
        message: "Project name",
        initialValue: dir,
      }),
  );

  const packageName = await resolveValue(
    flags.packageName,
    sanitizePackageName(name),
    flags.yes,
    () =>
      text({
        message: "Package name",
        initialValue: sanitizePackageName(name),
      }),
  );

  const botName = await resolveValue(
    flags.botName,
    startCase(name),
    flags.yes,
    () =>
      text({
        message: "Bot display name",
        initialValue: startCase(name),
      }),
  );

  const storage = await resolveValue<StorageKind>(
    flags.storage,
    defaults.storage,
    flags.yes,
    () =>
      select({
        message: "Bight state layer / database setup",
        options: [
          { value: "json", label: "JSON config/state" },
          { value: "keyv", label: "Keyv config/state" },
          { value: "drizzle", label: "Drizzle ORM + Bight storage bridge" },
          { value: "prisma", label: "Prisma ORM + Bight storage bridge" },
          { value: "mongoose", label: "Mongo + Mongoose + Bight storage bridge" },
        ],
      }),
  );

  const sqlProvider =
    storage === "drizzle" || storage === "prisma"
      ? await resolveValue<SqlProvider>(
          flags.sqlProvider,
          defaults.sqlProvider,
          flags.yes,
          () =>
            select({
              message: "SQL provider",
              options: [
                { value: "sqlite", label: "SQLite" },
                { value: "postgres", label: "Postgres" },
                { value: "mysql", label: "MySQL" },
              ],
            }),
        )
      : undefined;

  const keyvStore =
    storage === "keyv"
      ? await resolveValue<KeyvStore>(
          flags.keyvStore,
          defaults.keyvStore,
          flags.yes,
          () =>
            select({
              message: "Keyv backend",
              options: [
                { value: "sqlite", label: "SQLite" },
                { value: "postgres", label: "Postgres" },
                { value: "mysql", label: "MySQL" },
                { value: "redis", label: "Redis" },
              ],
            }),
        )
      : undefined;

  const commandMode = await resolveValue<CommandMode>(
    flags.commandMode,
    defaults.commandMode,
    flags.yes,
    () =>
      select({
        message: "Default command deployment mode",
        options: [
          { value: "global", label: "Global" },
          { value: "guild", label: "Guild-first" },
        ],
      }),
  );

  const cooldowns = await resolveValue(
    flags.cooldowns,
    defaults.cooldowns,
    flags.yes,
    () =>
      confirm({
        message: "Enable built-in command cooldowns?",
        initialValue: defaults.cooldowns,
      }),
  );

  const extras = await resolveValue<ExtraName[]>(
    flags.extras,
    defaults.extras,
    flags.yes,
    () =>
      multiselect({
        message: "Curated extras",
        required: false,
        options: [
          { value: "validation", label: "Validation toolkit" },
          { value: "scheduler", label: "Scheduler" },
          { value: "devtools", label: "Bight devtools" },
          { value: "i18n", label: "Localization" },
          { value: "settings", label: "Settings service" },
          { value: "message-commands", label: "Message commands" },
          { value: "prefix-commands", label: "Prefix commands" },
          { value: "startup-checks", label: "Startup checks" },
          { value: "formatters", label: "Discord formatters examples" },
          { value: "time", label: "Time toolkit" },
          { value: "cache", label: "Cache toolkit" },
          { value: "dev-commands", label: "Developer commands" },
        ],
        initialValues: defaults.extras,
      }),
  );

  const git = await resolveValue(
    flags.git,
    defaults.git,
    flags.yes,
    () =>
      confirm({
        message: "Initialize git?",
        initialValue: defaults.git,
      }),
  );

  const install = await resolveValue(
    flags.install,
    defaults.install,
    flags.yes,
    () =>
      confirm({
        message: "Install dependencies with pnpm?",
        initialValue: defaults.install,
      }),
  );

  if (!flags.yes) {
    outro("Scaffolding project");
  }

  return {
    dir,
    name,
    packageName,
    botName,
    storage,
    sqlProvider,
    keyvStore,
    commandMode,
    cooldowns,
    extras,
    git,
    install,
    yes: Boolean(flags.yes),
  };
}

async function resolveValue<T>(
  currentValue: T | undefined,
  fallbackValue: T,
  yes: boolean | undefined,
  prompt: () => Promise<T | symbol>,
): Promise<T> {
  if (currentValue !== undefined) {
    return currentValue;
  }

  if (yes) {
    return fallbackValue;
  }

  const result = await prompt();
  if (isCancel(result)) {
    cancel("Operation cancelled.");
    process.exit(1);
  }

  return result as T;
}

function getDefaults() {
  return {
    dir: "my-discord-bot",
    storage: "json" as StorageKind,
    sqlProvider: "sqlite" as SqlProvider,
    keyvStore: "sqlite" as KeyvStore,
    commandMode: "guild" as CommandMode,
    cooldowns: true,
    extras: ["validation", "formatters"] as ExtraName[],
    git: true,
    install: true,
  };
}

function sanitizePackageName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
}

function startCase(value: string): string {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
