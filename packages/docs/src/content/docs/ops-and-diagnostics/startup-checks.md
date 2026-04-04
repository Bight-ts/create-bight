---
title: Startup Checks
description: Validate environment and services before connecting to Discord.
---

The `@bight-ts/plugin-ops` startup checks plugin validates that required environment variables, services, and gateway intents are present before the bot connects to Discord. This catches misconfigurations at boot instead of letting them surface as silent runtime failures.

## Setup

```ts title="src/plugins/startup-checks.ts"
import { createStartupChecksPlugin } from "@bight-ts/plugin-ops";
import { GatewayIntentBits } from "discord.js";

export const startupChecksPlugin = createStartupChecksPlugin({
  requiredEnv: ["DISCORD_TOKEN", "DISCORD_CLIENT_ID", "DATABASE_URL"],

  requiredIntents: [GatewayIntentBits.Guilds],

  requiredServices: [
    {
      name: "Prisma Client",
      get: (context) => context.services.prisma,
    },
  ],
});
```

Add to `src/plugins/index.ts`.

## Fail vs warn

| Mode   | Behavior                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `warn` | Logs warnings but allows the bot to continue starting. Useful during local development when not all services may be available. |
| `fail` | Throws an error and prevents login. Use this in production to fail fast on misconfiguration.                                   |

Configure the mode through the plugin options or environment-based logic.
