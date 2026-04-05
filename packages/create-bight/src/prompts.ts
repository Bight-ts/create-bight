import {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  note,
  select,
  text,
} from "@clack/prompts";
import color from "picocolors";
import { basename } from "node:path";
import process from "node:process";
import {
  detectPackageManager,
  getPackageManagerLabel,
} from "./package-manager.js";
import { getScaffoldTemplate, scaffoldTemplates } from "./templates.js";
import type {
  CliOptions,
  CommandMode,
  ExtraName,
  KeyvStore,
  PackageManager,
  SqlProvider,
  StorageKind,
  TemplateName,
} from "./types.js";

type PartialFlags = Partial<CliOptions>;
type NamingMode = "derived" | "custom";
type InstallChoice = PackageManager | "skip";

export async function resolveOptions(flags: PartialFlags): Promise<CliOptions> {
  const defaults = getDefaults();

  if (!flags.yes) {
    intro(createIntroBanner());
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

  const derivedNames = createDerivedNames(dir);

  const namingMode =
    flags.name !== undefined || flags.packageName !== undefined || flags.botName !== undefined
      ? "custom"
      : await resolveValue<NamingMode>(
          undefined,
          "derived",
          flags.yes,
          async () => {
            note(
              [
                `Project label: ${derivedNames.name}`,
                `Package name: ${derivedNames.packageName}`,
                `Bot display name: ${derivedNames.botName}`,
              ].join("\n"),
              "Derived names",
            );

            return select({
              message: "Naming setup",
              initialValue: "derived",
              options: [
                {
                  value: "derived",
                  label: "Use derived names",
                  hint: "Fast path. You can rename things later.",
                },
                {
                  value: "custom",
                  label: "Customize names",
                  hint: "Change the project label, package name, and bot display name now.",
                },
              ],
            });
          },
        );

  const shouldCustomizeNames = namingMode === "custom";

  const name = shouldCustomizeNames || flags.name !== undefined
    ? await resolveValue(
        flags.name,
        derivedNames.name,
        flags.yes,
        () =>
          text({
            message: "Project label",
            initialValue: derivedNames.name,
          }),
      )
    : derivedNames.name;

  const packageName = shouldCustomizeNames || flags.packageName !== undefined
    ? await resolveValue(
        flags.packageName,
        derivedNames.packageName,
        flags.yes,
        () =>
          text({
            message: "Package name",
            initialValue: derivedNames.packageName,
          }),
      )
    : derivedNames.packageName;

  const botName = shouldCustomizeNames || flags.botName !== undefined
    ? await resolveValue(
        flags.botName,
        derivedNames.botName,
        flags.yes,
        () =>
          text({
            message: "Bot display name",
            initialValue: derivedNames.botName,
          }),
      )
    : derivedNames.botName;

  const template = await resolveValue<TemplateName>(
    flags.template,
    defaults.template,
    flags.yes,
    () =>
      select({
        message: "Scaffold template",
        initialValue: defaults.template,
        options: scaffoldTemplates.map((entry) => ({
          value: entry.value,
          label: entry.label,
          hint: entry.hint,
        })),
      }),
  );
  const templateDefaults = getScaffoldTemplate(template).defaults;

  const storage = await resolveValue<StorageKind>(
    flags.storage,
    templateDefaults.storage,
    flags.yes,
    () =>
      select({
        message: "Storage and data setup",
        initialValue: templateDefaults.storage,
        options: [
          {
            value: "json",
            label: "JSON file",
            hint: "Simple local config and state. Best default for quick starts.",
          },
          {
            value: "keyv",
            label: "Keyv",
            hint: "A lightweight state layer backed by Redis, SQLite, Postgres, or MySQL.",
          },
          {
            value: "drizzle",
            label: "Drizzle + Bight state bridge",
            hint: "Use Drizzle directly for app data and Bight storage for framework state.",
          },
          {
            value: "prisma",
            label: "Prisma + Bight state bridge",
            hint: "Use Prisma directly for app data and Bight storage for framework state.",
          },
          {
            value: "mongoose",
            label: "Mongoose + Bight state bridge",
            hint: "Use Mongoose directly for app data and Bight storage for framework state.",
          },
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
              initialValue: defaults.sqlProvider,
              options: [
                { value: "sqlite", label: "SQLite", hint: "Zero setup and great for local work." },
                { value: "postgres", label: "Postgres", hint: "Strong default for hosted apps." },
                { value: "mysql", label: "MySQL", hint: "Use if that matches your stack." },
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
              initialValue: defaults.keyvStore,
              options: [
                { value: "sqlite", label: "SQLite", hint: "Local file-backed default." },
                { value: "postgres", label: "Postgres", hint: "Reuse an existing Postgres instance." },
                { value: "mysql", label: "MySQL", hint: "Reuse an existing MySQL instance." },
                { value: "redis", label: "Redis", hint: "Good fit for fast network-backed state." },
              ],
            }),
        )
      : undefined;

  const commandMode = await resolveValue<CommandMode>(
    flags.commandMode,
    templateDefaults.commandMode,
    flags.yes,
    () =>
      select({
        message: "Default command deployment mode",
        initialValue: templateDefaults.commandMode,
        options: [
          {
            value: "guild",
            label: "Guild-first",
            hint: "Fast iteration. Great for development and testing.",
          },
          {
            value: "global",
            label: "Global",
            hint: "Matches production visibility but deploys more slowly.",
          },
        ],
      }),
  );

  const cooldowns = await resolveValue(
    flags.cooldowns,
    templateDefaults.cooldowns,
    flags.yes,
    () =>
      confirm({
        message: "Enable built-in command cooldowns?",
        active: "Yes",
        inactive: "No",
        initialValue: templateDefaults.cooldowns,
      }),
  );

  const extras = await resolveValue<ExtraName[]>(
    flags.extras,
    templateDefaults.extras,
    flags.yes,
    () =>
      multiselect({
        message: "Curated extras",
        required: false,
        options: [
          { value: "validation", label: "Validation toolkit", hint: "Zod formatting and validation helpers." },
          { value: "scheduler", label: "Scheduler", hint: "Persistent scheduled tasks." },
          { value: "devtools", label: "Bight devtools", hint: "Runtime diagnostics and inspection command." },
          { value: "i18n", label: "Localization", hint: "Locale-aware app strings and helpers." },
          { value: "settings", label: "Settings service", hint: "Typed guild settings on top of Bight storage." },
          { value: "message-commands", label: "Message commands", hint: "Text-triggered commands for hybrid bots." },
          { value: "prefix-commands", label: "Prefix commands", hint: "Classic !command support." },
          { value: "startup-checks", label: "Startup checks", hint: "Boot-time validation for env, intents, and services." },
          { value: "formatters", label: "Discord formatters examples", hint: "A small examples module for Discord output formatting." },
          { value: "time", label: "Time toolkit", hint: "Small time helpers from @bight-ts/toolkit." },
          { value: "cache", label: "Cache toolkit", hint: "In-memory cache and inflight dedupe helpers." },
          { value: "dev-commands", label: "Developer commands", hint: "A few extra app-side dev helpers." },
        ],
        initialValues: templateDefaults.extras,
      }),
  );

  const dependencySetup = await resolveDependencySetup(flags, defaults.packageManager);
  const packageManager =
    dependencySetup === "skip" ? (flags.packageManager ?? defaults.packageManager) : dependencySetup;
  const install = dependencySetup !== "skip";

  const git = await resolveValue(
    flags.git,
    defaults.git,
    flags.yes,
    () =>
      confirm({
        message: "Initialize git?",
        active: "Yes",
        inactive: "No",
        initialValue: defaults.git,
      }),
  );

  return {
    dir,
    name,
    packageName,
    botName,
    template,
    storage,
    sqlProvider,
    keyvStore,
    commandMode,
    cooldowns,
    extras,
    packageManager,
    install,
    git,
    yes: Boolean(flags.yes),
  };
}

async function resolveDependencySetup(
  flags: PartialFlags,
  defaultPackageManager: PackageManager,
): Promise<InstallChoice> {
  if (flags.install === false) {
    return "skip";
  }

  if (flags.install === true && flags.packageManager) {
    return flags.packageManager;
  }

  if (flags.yes) {
    return flags.packageManager ?? defaultPackageManager;
  }

  const initialValue =
    flags.packageManager ?? defaultPackageManager;

  return await resolveValue<InstallChoice>(
    undefined,
    initialValue,
    false,
    () =>
      select({
        message: "Dependency setup",
        initialValue,
        options: [
          {
            value: "pnpm",
            label: "Install now with pnpm",
            hint:
              defaultPackageManager === "pnpm"
                ? "Detected from how you launched the CLI."
                : "Great default for workspace-heavy projects.",
          },
          {
            value: "bun",
            label: "Install now with Bun",
            hint:
              defaultPackageManager === "bun"
                ? "Detected from how you launched the CLI."
                : "Fast install and run loop if you already use Bun.",
          },
          {
            value: "npm",
            label: "Install now with npm",
            hint:
              defaultPackageManager === "npm"
                ? "Detected from how you launched the CLI."
                : "Works everywhere with no extra tooling.",
          },
          {
            value: "yarn",
            label: "Install now with Yarn",
            hint:
              defaultPackageManager === "yarn"
                ? "Detected from how you launched the CLI."
                : "Useful if Yarn is already your standard.",
          },
          {
            value: "skip",
            label: "Skip install",
            hint: `Scaffold only. Suggested commands will use ${getPackageManagerLabel(defaultPackageManager)}.`,
          },
        ],
      }),
  );
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
  const starterTemplate = getScaffoldTemplate("starter");

  return {
    dir: "my-discord-bot",
    template: starterTemplate.value,
    storage: starterTemplate.defaults.storage,
    sqlProvider: "sqlite" as SqlProvider,
    keyvStore: "sqlite" as KeyvStore,
    commandMode: starterTemplate.defaults.commandMode,
    cooldowns: starterTemplate.defaults.cooldowns,
    extras: [...starterTemplate.defaults.extras] as ExtraName[],
    packageManager: detectPackageManager(),
    git: true,
    install: true,
  };
}

function sanitizePackageName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function startCase(value: string): string {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createDerivedNames(dir: string) {
  const projectSlug = sanitizePackageName(basename(dir)) || "my-discord-bot";

  return {
    name: projectSlug,
    packageName: projectSlug,
    botName: startCase(projectSlug),
  };
}

function createIntroBanner() {
  const lines = [
    color.cyan(" ____  _       _     _     _   "),
    color.blue("| __ )(_) __ _| |__ | |_  | |_ "),
    color.magenta("|  _ \\| |/ _` | '_ \\| __| | __|"),
    color.yellow("| |_) | | (_| | | | | |_  | |_ "),
    color.red("|____/|_|\\__, |_| |_|\\__|  \\__|"),
    color.red("         |___/                 "),
  ];

  return `${lines.join("\n")}\n${color.dim("Discord-first TypeScript bot scaffolding")}`;
}
