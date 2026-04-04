---
title: Slash Commands
description: Define, structure, and deploy slash commands in Bight.
---

Slash commands are Bight's primary interface. Each `.ts` file in `src/commands/` is automatically discovered and registered on boot.

## Basic command

```ts title="src/commands/ping.ts"
import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { defineCommand } from "@bight-ts/core";

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Reply with pong."),

  async execute({ interaction }) {
    await interaction.reply({
      content: "Pong.",
      flags: MessageFlags.Ephemeral,
    });
  },
});
```

`defineCommand` accepts standard Discord.js builders. There's no Bight-specific DSL for command metadata.

## Subcommands

For commands with subcommands, use `defineSubcommand` instead of manually branching on `interaction.options.getSubcommand()`:

```ts title="src/commands/config.ts"
import { SlashCommandBuilder } from "discord.js";
import { defineCommand, defineSubcommand } from "@bight-ts/core";

const view = defineSubcommand({
  name: "view",
  description: "View the current configuration.",
  async execute({ interaction, context }) {
    const settings = await context.services.guildSettings.get(
      interaction.guildId!,
    );
    await interaction.reply(`Prefix: ${settings.prefix}`);
  },
});

const reset = defineSubcommand({
  name: "reset",
  description: "Reset configuration to defaults.",
  build: (builder) =>
    builder.addBooleanOption((o) =>
      o
        .setName("confirm")
        .setDescription("Confirm the reset.")
        .setRequired(true),
    ),
  async execute({ interaction, context }) {
    // Handle reset logic
    await interaction.reply("Configuration reset.");
  },
});

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Manage bot configuration."),

  subcommands: [view, reset],
});
```

Each subcommand defines its own `execute` handler and can add options through the `build` callback.

## Command options

Commands support these additional properties alongside `data` and `execute`:

| Property        | Type                 | Description                                                                                                                  |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `preconditions` | `string[]`           | Named preconditions to evaluate before execution. See [Preconditions](/commands-and-interactions/preconditions-and-denied/). |
| `cooldown`      | `number`             | Cooldown duration in milliseconds between invocations per user.                                                              |
| `devOnly`       | `boolean`            | When `true`, the command is blocked in production environments.                                                              |
| `deployment`    | `CommandDeployment`  | Target specific guilds or global deployment.                                                                                 |
| `onDenied`      | `BightDeniedHandler` | Custom handler when a precondition rejects the user.                                                                         |
| `autocomplete`  | Function             | Handler for autocomplete interactions on this command's options.                                                             |

## Deploying command changes

Changes to command metadata (name, description, options) require a deploy to Discord. Runtime logic changes inside `execute()` do not.

```bash
pnpm deploy:commands:guild    # push to test guild (instant)
pnpm deploy:commands          # push globally (up to 1 hour cache delay)
```

See [Command Deploy Modes](/commands-and-interactions/command-modes/) for the full deployment strategy.
