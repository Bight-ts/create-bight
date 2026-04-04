import { createStartupChecksPlugin } from "@bight-ts/plugin-ops";
import { GatewayIntentBits } from "discord.js";

export const startupChecksPlugin = createStartupChecksPlugin({
  requiredEnv: ["DISCORD_TOKEN", "DISCORD_CLIENT_ID"],
  requiredIntents: [GatewayIntentBits.Guilds],
  requiredServices: [
    {
      name: "storage",
      get: (context) => context.services.storage,
    },
  ],
});
