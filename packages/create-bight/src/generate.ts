import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, join, resolve } from "node:path";
import { copyTemplateDir, ensureDir, pathExists } from "./utils.js";
import { templatesRoot } from "./config.js";
import {
  formatRunCommand,
  getPackageManagerInstallCommand,
} from "./package-manager.js";
import type { CliOptions } from "./types.js";
import { buildPackageJson } from "./package-json.js";

const execFileAsync = promisify(execFile);

export async function generateProject(options: CliOptions): Promise<string> {
  const targetDir = resolve(process.cwd(), options.dir);
  await ensureDir(targetDir);

  const replacements = createReplacements(options);
  const templateDirs = [
    join(templatesRoot, "base"),
    join(templatesRoot, `storage-${options.storage}`),
    ...options.extras.map((extra) => join(templatesRoot, `extras-${extra}`)),
  ];

  for (const dir of templateDirs) {
    if (await pathExists(dir)) {
      await copyTemplateDir(dir, targetDir, replacements);
    }
  }

  await writeJson(join(targetDir, "package.json"), buildPackageJson(options));
  await writeGeneratedConfigFiles(targetDir, options);

  if (options.git) {
    await execFileAsync("git", ["init"], { cwd: targetDir });
  }

  if (options.install) {
    const installCommand = getPackageManagerInstallCommand(options.packageManager);
    await execFileAsync(installCommand.command, installCommand.args, { cwd: targetDir });
  }

  return targetDir;
}

async function writeGeneratedConfigFiles(
  targetDir: string,
  options: CliOptions,
): Promise<void> {
  await writeFile(
    join(targetDir, "src/bight.ts"),
    createBightFile(options),
    "utf8",
  );

  await writeFile(
    join(targetDir, "src/services/index.ts"),
    createServicesIndex(options),
    "utf8",
  );

  await writeFile(
    join(targetDir, "src/plugins/index.ts"),
    createPluginsIndex(options),
    "utf8",
  );

  await writeFile(
    join(targetDir, "src/commands/guild-config.ts"),
    createGuildConfigCommand(options),
    "utf8",
  );

  await writeFile(
    join(targetDir, "README.md"),
    createReadme(options),
    "utf8",
  );

  await writeFile(
    join(targetDir, ".env.example"),
    createEnvExample(options),
    "utf8",
  );

  if (options.storage === "drizzle" && options.sqlProvider) {
    await writeFile(
      join(targetDir, "src/db/client.ts"),
      createDrizzleClient(options.sqlProvider),
      "utf8",
    );

    await writeFile(
      join(targetDir, "drizzle.config.ts"),
      createDrizzleConfig(options.sqlProvider),
      "utf8",
    );
  }

  if (options.storage === "prisma" && options.sqlProvider) {
    await writeFile(
      join(targetDir, "prisma/schema.prisma"),
      createPrismaSchema(options.sqlProvider),
      "utf8",
    );
  }

  if (options.extras.includes("settings")) {
    await writeFile(
      join(targetDir, "src/services/settings.ts"),
      createSettingsServiceFile(),
      "utf8",
    );
  }

  if (options.extras.includes("startup-checks")) {
    await writeFile(
      join(targetDir, "src/plugins/startup-checks.ts"),
      createStartupChecksPluginFile(options),
      "utf8",
    );
  }

  if (options.extras.includes("prefix-commands")) {
    await writeFile(
      join(targetDir, "src/plugins/prefix-commands.ts"),
      createPrefixCommandsPluginFile(options),
      "utf8",
    );
  }
}

async function writeJson(path: string, payload: unknown): Promise<void> {
  await ensureDir(dirname(path));
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function createReplacements(options: CliOptions): Record<string, string> {
  return {
    "__PROJECT_NAME__": options.name,
    "__PACKAGE_NAME__": options.packageName,
    "__BOT_NAME__": options.botName,
    "__COMMAND_MODE__": options.commandMode,
    "__DEFAULT_TEST_GUILD_HINT__":
      options.commandMode === "guild"
        ? "DISCORD_TEST_GUILD_ID=123456789012345678"
        : "DISCORD_TEST_GUILD_ID=",
    "__DEFAULT_STORAGE_KIND__": options.storage,
    "__DEFAULT_COOLDOWNS__": String(options.cooldowns),
  };
}

function createReadme(options: CliOptions): string {
  const devCommand = formatRunCommand(options.packageManager, "dev");
  const buildCommand = formatRunCommand(options.packageManager, "build");
  const startCommand = formatRunCommand(options.packageManager, "start");
  const startWithDeployCommand = formatRunCommand(
    options.packageManager,
    "start:with-deploy",
  );
  const deployCommandsCommand = formatRunCommand(
    options.packageManager,
    "deploy:commands",
  );
  const storageGuidance =
    options.storage === "drizzle"
      ? "use `context.services.db` and `context.services.dbTables` for your real Drizzle queries; keep `src/storage/adapter.ts` for Bight's lightweight settings/state layer"
      : options.storage === "prisma"
        ? "use `context.services.prisma` for your real Prisma queries; keep `src/storage/adapter.ts` for Bight's lightweight settings/state layer"
        : options.storage === "mongoose"
        ? "use `context.services.connectToDatabase` and `context.services.databaseModels` for your real Mongoose work; keep `src/storage/adapter.ts` for Bight's lightweight settings/state layer"
        : "wire persistence in `src/storage/adapter.ts` and consume it through `src/storage/index.ts`";
  const selectedExtras =
    options.extras.length > 0
      ? options.extras.map((extra) => `\`${extra}\``).join(", ")
      : "none";
  const whereToStart = [
    "- put slash commands in `src/commands/`",
    "- add app-owned integrations in `src/services/index.ts`",
    "- consume Bight's small config/state storage through `src/storage/index.ts`",
    `- ${storageGuidance}`,
    "- register lifecycle work in `src/plugins/index.ts`",
    "- treat `src/bight.ts` as the framework seam you usually do not need to edit first",
    "- add larger app slices in `src/features/` later if the project grows",
  ];
  const selectedFeatureNotes: string[] = [];

  if (options.extras.includes("i18n")) {
    whereToStart.push("- edit localization catalogs in `src/i18n/catalog.ts`");
  }

  if (options.extras.includes("settings")) {
    whereToStart.push("- adjust Bight-backed guild settings in `src/services/settings.ts`");
  }

  if (options.extras.includes("message-commands")) {
    whereToStart.push("- add free-form message triggers in `src/message-commands/`");
  }

  if (options.extras.includes("prefix-commands")) {
    whereToStart.push("- add classic prefix commands in `src/prefix-commands/`");
  }

  if (options.extras.includes("startup-checks")) {
    whereToStart.push("- tune startup validation in `src/plugins/startup-checks.ts`");
  }

  if (options.storage === "drizzle" || options.storage === "mongoose") {
    whereToStart.push("- adjust database wiring in `src/db/` if your backend setup changes");
  }

  if (options.storage === "prisma") {
    whereToStart.push(
      "- adjust Prisma wiring in `prisma/schema.prisma` and `src/db/client.ts` when your data model grows",
    );
  }

  if (usesToolkitExtras(options.extras)) {
    selectedFeatureNotes.push(
      "Selected toolkit extras install `@bight-ts/toolkit`. Use it for lightweight cache, time, and validation helpers before creating one-off app snippets.",
    );
  }

  if (options.extras.includes("scheduler")) {
    selectedFeatureNotes.push(
      "Selected scheduler scaffolds `@bight-ts/plugin-scheduler` in persistent mode using your app storage.",
    );
  }

  if (options.extras.includes("devtools")) {
    selectedFeatureNotes.push(
      "Selected devtools scaffolds `@bight-ts/plugin-devtools`. It is enabled by default in development and adds `/bight-devtools`.",
    );
  }

  if (options.extras.includes("i18n")) {
    selectedFeatureNotes.push(
      "Selected localization scaffolds `@bight-ts/i18n` as an app-owned service plus an optional diagnostics plugin.",
    );
  }

  if (options.extras.includes("settings")) {
    selectedFeatureNotes.push(
      "Selected settings scaffolds `@bight-ts/settings` so app config uses a namespaced service instead of raw storage calls.",
    );
  }

  if (options.extras.includes("startup-checks")) {
    selectedFeatureNotes.push(
      "Selected startup checks scaffolds `@bight-ts/plugin-ops` so env, intents, and required services are validated through a normal plugin.",
    );
  }

  return `# ${options.name}

Generated with Bight, the modern Discord-first framework for readable TypeScript bots.

## Scripts

- \`${devCommand}\`: run the bot in watch mode
- \`${buildCommand}\`: compile TypeScript
- \`${startCommand}\`: run the compiled bot
- \`${startWithDeployCommand}\`: register commands, build, then start
- \`${deployCommandsCommand}\`: deploy commands using the default mode

## Selected options

- template: \`${options.template}\`
- storage: \`${options.storage}\`
- command mode: \`${options.commandMode}\`
- package manager: \`${options.packageManager}\`
- cooldowns: \`${options.cooldowns ? "enabled" : "disabled"}\`
- extras: ${selectedExtras}

## Where To Start

${whereToStart.join("\n")}

Start by copying \`.env.example\` to \`.env\`, filling in the Discord credentials, then run \`${startWithDeployCommand}\`.
${selectedFeatureNotes.length > 0 ? `\n\n${selectedFeatureNotes.join("\n\n")}` : ""}`;
}

function createServicesIndex(options: CliOptions): string {
  const imports = ['import { storage } from "~/storage/index.js";'];
  const constants: string[] = [];
  const services = ["    storage,"];

  if (options.storage === "drizzle") {
    imports.unshift('import { db, tables } from "~/db/client.js";');
    services.unshift("    dbTables: tables,");
    services.unshift("    db,");
  }

  if (options.storage === "prisma") {
    imports.unshift('import { prisma } from "~/db/client.js";');
    services.unshift("    prisma,");
  }

  if (options.storage === "mongoose") {
    imports.unshift(
      'import { connectToDatabase, GlobalConfigModel, GuildConfigModel } from "~/db/client.js";',
    );
    constants.push(`const databaseModels = {
  GlobalConfigModel,
  GuildConfigModel,
};`);
    services.unshift("    databaseModels,");
    services.unshift("    connectToDatabase,");
  }

  if (options.extras.includes("i18n")) {
    imports.unshift('import { createI18nService } from "@bight-ts/i18n";');
    imports.push('import { i18nCatalog } from "~/i18n/catalog.js";');
    constants.push(`const i18n = createI18nService({
  fallbackLocale: "en",
  resources: i18nCatalog,
});`);
    services.push("    i18n,");
  }

  if (options.extras.includes("settings")) {
    imports.push('import { guildSettings } from "~/services/settings.js";');
    services.push("    guildSettings,");
  }

  return `${imports.join("\n")}

${constants.join("\n\n")}${constants.length > 0 ? "\n\n" : ""}/**
 * App-owned services live here.
 *
 * Add external clients, reusable helpers, and integrations here first.
 * If you selected Drizzle, Prisma, or Mongoose, their native app query surface
 * belongs here too. Bight storage stays the smaller config/state layer.
 * Lightweight official batteries like \`@bight-ts/toolkit\` can also be wired here.
 * If an integration needs lifecycle hooks around startup, reach for
 * \`src/plugins/\` next.
 */
export function createAppServices() {
  return {
${services.join("\n")}
  };
}

export type AppServices = ReturnType<typeof createAppServices>;
`;
}

function createBightFile(options: CliOptions): string {
  const hybridIntents = usesHybridExtras(options.extras)
    ? [
      "GatewayIntentBits.Guilds",
      "GatewayIntentBits.GuildMessages",
      "GatewayIntentBits.MessageContent",
    ]
    : ["GatewayIntentBits.Guilds"];

  return `import {
  createBightApp,
  createFilesystemDiscovery,
  createLogger,
  createMemoryCooldownStore,
  defineButtonHandler,
  defineCommand,
  defineEvent,
  defineFeature,
  defineModalHandler,
  definePrecondition,
  defineSelectMenuHandler,
  defineSubcommand,
  type BightFeature,
  type BightSubcommand,
  type BotCommand,
  type BotEvent,
  type BightPrecondition,
  type ButtonHandler,
  type ModalHandler,
  type SelectMenuHandler,
} from "@bight-ts/core";
import { GatewayIntentBits, type ClientEvents } from "discord.js";
import { cooldownsEnabled, getDefaultCooldownSeconds, isDevelopment } from "~/config/app.js";
import { env } from "~/config/env.js";
import { appPlugins } from "~/plugins/index.js";
import { createAppServices, type AppServices } from "~/services/index.js";

/**
 * Bight runtime wiring.
 *
 * Most apps can ignore this file and work in \`commands/\`, \`events/\`,
 * \`interactions/\`, \`preconditions/\`, \`plugins/\`, and \`services/\`.
 *
 * Come back here when you want to customize how Bight boots, discovers
 * modules, or applies runtime policies.
 */
const discovery = createFilesystemDiscovery<AppServices>(import.meta.url);

export function defineAppCommand(command: BotCommand<AppServices>) {
  return defineCommand(command);
}

export function defineAppSubcommand(subcommand: BightSubcommand<AppServices>) {
  return defineSubcommand(subcommand);
}

export function defineAppEvent<K extends keyof ClientEvents>(event: BotEvent<K, AppServices>) {
  return defineEvent(event);
}

export function defineAppPrecondition(precondition: BightPrecondition<AppServices>) {
  return definePrecondition(precondition);
}

export function defineAppButtonHandler(handler: ButtonHandler<AppServices>) {
  return defineButtonHandler(handler);
}

export function defineAppModalHandler(handler: ModalHandler<AppServices>) {
  return defineModalHandler(handler);
}

export function defineAppSelectMenuHandler(handler: SelectMenuHandler<AppServices>) {
  return defineSelectMenuHandler(handler);
}

export function defineAppFeature(feature: BightFeature<AppServices>) {
  return defineFeature(feature);
}

export const loadRegistry = discovery.loadRegistry;

const botApp = createBightApp<AppServices>({
  clientOptions: {
    intents: [${hybridIntents.join(", ")}],
  },
  createLogger: () =>
    createLogger("app", {
      level: env.LOG_LEVEL ?? (env.NODE_ENV === "development" ? "debug" : "info"),
    }),
  createServices: () => createAppServices(),
  loadRegistry,
  loadEvents: discovery.loadEvents,
  loadPlugins: () => appPlugins,
  runtime: {
    cooldowns: {
      enabled: cooldownsEnabled(),
      defaultSeconds: getDefaultCooldownSeconds(),
      store: createMemoryCooldownStore(),
    },
    environment: {
      isDevelopment: isDevelopment(),
    },
  },
});

export async function createBotRuntime() {
  return botApp.createRuntime();
}

export async function startBot() {
  await botApp.start(env.DISCORD_TOKEN);
}

export type { AppServices } from "~/services/index.js";
`;
}

function createEnvExample(options: CliOptions): string {
  const lines = [
    "DISCORD_TOKEN=your_discord_bot_token",
    "DISCORD_CLIENT_ID=your_discord_application_id",
    "__DEFAULT_TEST_GUILD_HINT__",
    "NODE_ENV=development",
    "LOG_LEVEL=debug",
    "",
    `COMMAND_DEPLOYMENT_MODE=${options.commandMode}`,
    `COMMAND_COOLDOWNS_ENABLED=${String(options.cooldowns)}`,
    "DEFAULT_COMMAND_COOLDOWN_SECONDS=3",
  ];

  if (options.storage === "json") {
    lines.push("JSON_STORAGE_PATH=./data/config.json");
  }

  if (options.storage === "keyv") {
    lines.push(`KEYV_URL=${createDefaultKeyvUrl(options.keyvStore)}`);
    lines.push(`KEYV_STORE=${options.keyvStore ?? "sqlite"}`);
  }

  if (options.storage === "drizzle" || options.storage === "prisma") {
    lines.push("DATABASE_URL=");
  }

  if (options.storage === "mongoose") {
    lines.push("MONGODB_URI=");
  }

  return lines.join("\n").replace(
    "__DEFAULT_TEST_GUILD_HINT__",
    options.commandMode === "guild"
      ? "DISCORD_TEST_GUILD_ID=123456789012345678"
      : "DISCORD_TEST_GUILD_ID=",
  ) + "\n";
}

function createDrizzleClient(provider: NonNullable<CliOptions["sqlProvider"]>): string {
  if (provider === "postgres") {
    return `import { createPostgresStorageTables } from "@bight-ts/storage-drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/config/env.js";

export const tables = createPostgresStorageTables();
export const { globalConfigs, guildConfigs } = tables;

const client = postgres(env.DATABASE_URL ?? "postgres://localhost:5432/discord_bot");
export const db = drizzle(client);
`;
  }

  if (provider === "mysql") {
    return `import { createMysqlStorageTables } from "@bight-ts/storage-drizzle";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "~/config/env.js";

export const tables = createMysqlStorageTables();
export const { globalConfigs, guildConfigs } = tables;

const connection = mysql.createPool(env.DATABASE_URL ?? "mysql://root:root@localhost:3306/discord_bot");
export const db = drizzle(connection);
`;
  }

  return `import { createSqliteStorageTables } from "@bight-ts/storage-drizzle";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { env } from "~/config/env.js";

export const tables = createSqliteStorageTables();
export const { globalConfigs, guildConfigs } = tables;

export const db = drizzleSqlite(env.DATABASE_URL || "data/drizzle.sqlite");
`;
}

function createDrizzleConfig(provider: NonNullable<CliOptions["sqlProvider"]>): string {
  const dialect = provider === "postgres" ? "postgresql" : provider;
  const fallback =
    provider === "postgres"
      ? "postgres://localhost:5432/discord_bot"
      : provider === "mysql"
        ? "mysql://root:root@localhost:3306/discord_bot"
        : "data/drizzle.sqlite";

  return `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/client.ts",
  dialect: "${dialect}",
  dbCredentials: {
    url: process.env.DATABASE_URL || "${fallback}",
  },
});
`;
}

function createPrismaSchema(provider: NonNullable<CliOptions["sqlProvider"]>): string {
  return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

model GlobalConfig {
  key   String @id
  value Json
}

model GuildConfig {
  guildId String @id
  value   Json
}
`;
}

function usesToolkitExtras(extras: CliOptions["extras"]) {
  return extras.some((extra) =>
    extra === "cache" || extra === "time" || extra === "validation"
  );
}

function usesHybridExtras(extras: CliOptions["extras"]) {
  return extras.some((extra) => extra === "message-commands" || extra === "prefix-commands");
}

function createDefaultKeyvUrl(store: CliOptions["keyvStore"]) {
  if (store === "postgres") {
    return "postgres://localhost:5432/bight";
  }

  if (store === "mysql") {
    return "mysql://root:root@localhost:3306/bight";
  }

  if (store === "redis") {
    return "redis://localhost:6379";
  }

  return "sqlite://data/keyv.sqlite";
}

function createPluginsIndex(options: CliOptions): string {
  const imports = ['import { defineAppPlugins } from "./define.js";'];
  const plugins: string[] = [];

  if (options.extras.includes("startup-checks")) {
    imports.push('import startupChecksPlugin from "./startup-checks.js";');
    plugins.push("  startupChecksPlugin,");
  }

  if (options.extras.includes("scheduler")) {
    imports.push('import schedulerPlugin from "./scheduler.js";');
    plugins.push("  schedulerPlugin,");
  }

  if (options.extras.includes("devtools")) {
    imports.push('import devtoolsPlugin from "./devtools.js";');
    plugins.push("  devtoolsPlugin,");
  }

  if (options.extras.includes("i18n")) {
    imports.push('import i18nPlugin from "./i18n.js";');
    plugins.push("  i18nPlugin,");
  }

  if (options.extras.includes("message-commands")) {
    imports.push('import messageCommandsPlugin from "./message-commands.js";');
    plugins.push("  messageCommandsPlugin,");
  }

  if (options.extras.includes("prefix-commands")) {
    imports.push('import prefixCommandsPlugin from "./prefix-commands.js";');
    plugins.push("  prefixCommandsPlugin,");
  }

  return `${imports.join("\n")}

/**
 * Register app plugins explicitly here.
 *
 * Services are app-owned dependencies that handlers call directly.
 * Plugins participate in the Bight lifecycle and can register behavior
 * around startup and login.
 */
export const appPlugins = defineAppPlugins([
${plugins.join("\n")}
]);
`;
}

function createSettingsServiceFile() {
  return `import { createGuildSettingsService } from "@bight-ts/settings";
import { storage } from "~/storage/index.js";

export const guildSettings = createGuildSettingsService({
  storage,
  key: "app",
  defaults: {
    prefix: "!",
    featureFlags: {},
  },
});
`;
}

function createStartupChecksPluginFile(options: CliOptions) {
  const requiredServices = [
    `  {
    name: "storage",
    get: (context) => context.services.storage,
  },`,
    ...(options.extras.includes("i18n")
      ? [`  {
    name: "i18n",
    get: (context) => context.services.i18n,
  },`]
      : []),
    ...(options.extras.includes("settings")
      ? [`  {
    name: "guildSettings",
    get: (context) => context.services.guildSettings,
  },`]
      : []),
  ];
  const requiredIntents = usesHybridExtras(options.extras)
    ? [
      "GatewayIntentBits.Guilds",
      "GatewayIntentBits.GuildMessages",
      "GatewayIntentBits.MessageContent",
    ]
    : ["GatewayIntentBits.Guilds"];

  return `import { createStartupChecksPlugin } from "@bight-ts/plugin-ops";
import { GatewayIntentBits } from "discord.js";
import type { AppServices } from "~/services/index.js";

export default createStartupChecksPlugin<AppServices>({
  requiredEnv: ["DISCORD_TOKEN", "DISCORD_CLIENT_ID"],
  requiredIntents: [${requiredIntents.join(", ")}],
  requiredServices: [
${requiredServices.join("\n")}
  ],
});
`;
}

function createPrefixCommandsPluginFile(options: CliOptions) {
  if (!options.extras.includes("settings")) {
    return `import { createPrefixCommandsPlugin } from "@bight-ts/plugin-prefix-commands";
import { prefixCommands } from "~/prefix-commands/index.js";
import type { AppServices } from "~/services/index.js";

export default createPrefixCommandsPlugin<AppServices>({
  commands: prefixCommands,
  // Replace this with storage-backed prefixes when your app needs per-guild config.
  getPrefixes: () => ["!"],
});
`;
  }

  return `import { createPrefixCommandsPlugin } from "@bight-ts/plugin-prefix-commands";
import { prefixCommands } from "~/prefix-commands/index.js";
import type { AppServices } from "~/services/index.js";

export default createPrefixCommandsPlugin<AppServices>({
  commands: prefixCommands,
  async getPrefixes({ context, message }) {
    if (!message.guildId) {
      return ["!"];
    }

    const settings = await context.services.guildSettings.get(message.guildId);
    return [settings.prefix];
  },
});
`;
}

function createGuildConfigCommand(options: CliOptions) {
  const guildConfigRead = options.extras.includes("settings")
    ? `const config = await context.services.guildSettings.get(interaction.guildId);`
    : `const config = await context.services.storage.guilds.ensure(interaction.guildId, {
      prefix: "!",
      featureFlags: {},
    });`;
  const guildConfigUpdate = options.extras.includes("settings")
    ? `const updated = await context.services.guildSettings.update(interaction.guildId, {
      prefix,
    });`
    : `const updated = await context.services.storage.guilds.patch<{ prefix: string }>(
      interaction.guildId,
      {
        prefix,
      },
    );`;

  return `import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { defineAppCommand, defineAppSubcommand } from "~/bight.js";

const showGuildConfig = defineAppSubcommand({
  name: "show",
  description: "Show the stored guild config.",
  async execute({ interaction, context }) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a guild.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    ${guildConfigRead}
    await interaction.reply({
      content: \`Stored guild config: \\\`${"${JSON.stringify(config)}"}\\\`\`,
      flags: MessageFlags.Ephemeral,
    });
  },
});

const setGuildPrefix = defineAppSubcommand({
  name: "set-prefix",
  description: "Store a sample prefix value.",
  build(builder) {
    return builder.addStringOption((option) =>
      option
        .setName("value")
        .setDescription("Prefix to store")
        .setRequired(true),
    );
  },
  async execute({ interaction, context }) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a guild.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const prefix = interaction.options.getString("value", true);
    ${guildConfigUpdate}
    await interaction.reply({
      content: \`Updated guild config: \\\`${"${JSON.stringify(updated)}"}\\\`\`,
      flags: MessageFlags.Ephemeral,
    });
  },
});

export default defineAppCommand({
  data: new SlashCommandBuilder()
    .setName("guild-config")
    .setDescription("Store or inspect guild-scoped config."),
  subcommands: [showGuildConfig, setGuildPrefix],
});
`;
}
