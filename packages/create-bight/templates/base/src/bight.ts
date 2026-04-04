import {
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
 * Most apps can ignore this file and work in `commands/`, `events/`,
 * `interactions/`, `preconditions/`, `plugins/`, and `services/`.
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
    intents: [GatewayIntentBits.Guilds],
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
