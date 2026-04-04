import { deployCommands, type DeploymentMode } from "@bight-ts/core";
import { createBotRuntime } from "~/bight.js";
import { env } from "~/config/env.js";
import { getDefaultDeploymentMode, isDevelopment } from "~/config/app.js";

function getMode(): DeploymentMode | undefined {
  const rawMode = process.argv.find((arg) => arg.startsWith("--mode="));
  if (!rawMode) {
    return undefined;
  }

  const value = rawMode.slice("--mode=".length);
  return value === "global" || value === "guild" ? value : undefined;
}

async function main() {
  const runtime = await createBotRuntime();

  try {
    await deployCommands({
      commands: runtime.registry.commands.values(),
      token: env.DISCORD_TOKEN,
      clientId: env.DISCORD_CLIENT_ID,
      mode: getMode() ?? getDefaultDeploymentMode(),
      testGuildId: env.DISCORD_TEST_GUILD_ID,
      isDevelopment: isDevelopment(),
    });
  } finally {
    runtime.client.destroy();
  }
}

void main();
