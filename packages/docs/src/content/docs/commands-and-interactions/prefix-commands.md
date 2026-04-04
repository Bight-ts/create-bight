---
title: Prefix Commands
description: Opt-in support for classic text-prefix commands via a dedicated plugin.
---

Bight is slash-first, but some communities rely on text commands like `!ban user` or `?info`. The `@bight-ts/plugin-prefix-commands` plugin adds opt-in support for prefix-based commands alongside the standard slash command system.

## Defining a prefix command

```ts title="src/prefix-commands/ping.ts"
import { definePrefixCommand } from "@bight-ts/plugin-prefix-commands";

export const pingPrefixCommand = definePrefixCommand({
  data: {
    name: "ping",
    description: "Reply with pong.",
  },
  async execute({ message }) {
    await message.reply("Pong.");
  },
});
```

Prefix commands use simple whitespace-based argument parsing. For structured option parsing (choices, required fields, type validation), use slash commands instead.

## Registering the plugin

```ts title="src/plugins/prefix-commands.ts"
import { createPrefixCommandsPlugin } from "@bight-ts/plugin-prefix-commands";
import { pingPrefixCommand } from "../prefix-commands/ping";

export const prefixCommandsPlugin = createPrefixCommandsPlugin({
  commands: [pingPrefixCommand],

  getPrefixes: async ({ context, message }) => {
    const settings = await context.services.guildSettings.get(
      message.guildId ?? "dm",
    );
    return [settings.prefix];
  },
});
```

The `getPrefixes` resolver runs per-message, so different guilds can use different prefixes. Add the plugin to `src/plugins/index.ts`.

## Required gateway intents

Prefix commands listen to message events. You must enable the `GuildMessages` and `MessageContent` intents in both `src/bight.ts` and the [Discord Developer Portal](https://discord.com/developers/applications) (MessageContent is a Privileged Intent).

See [Gateway Intents](/architecture/gateway-intents/).
