import {
  createBightApp,
  createFilesystemDiscovery,
  createLogger,
  createMemoryCooldownStore,
  type AppServices,
} from "@bight-ts/core";
import { GatewayIntentBits } from "discord.js";
import { appPlugins } from "~/plugins/index.js";
import { createAppServices } from "~/services/index.js";

const discovery = createFilesystemDiscovery<AppServices>({
  root: new URL(".", import.meta.url),
});

export const botApp = createBightApp<AppServices>({
  clientOptions: {
    intents: [GatewayIntentBits.Guilds],
  },
  createLogger: () => createLogger("app"),
  createServices: () => createAppServices(),
  loadRegistry: discovery.loadRegistry,
  loadEvents: discovery.loadEvents,
  loadPlugins: () => appPlugins,
  runtime: {
    cooldowns: {
      enabled: true,
      defaultSeconds: 3,
      store: createMemoryCooldownStore(),
    },
    environment: {
      isDevelopment: process.env.NODE_ENV === "development",
    },
  },
});
