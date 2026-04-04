---
title: Guild Settings
description: Typed, validated per-guild configuration with defaults.
---

The `@bight-ts/settings` package provides a schema-validated settings layer on top of Bight's [storage facade](/storage-and-data/settings-and-data/). It handles default values, Zod validation, and cache synchronization.

You define a schema and access fully typed settings through `context.services`.

## Defining the settings service

```ts title="src/services/settings.ts"
import { createGuildSettingsService } from "@bight-ts/settings";
import { z } from "zod";
import { storage } from "../storage";

export const guildSettings = createGuildSettingsService({
  storage,
  key: "app",
  defaults: {
    prefix: "!",
    logChannelId: null,
    featureFlags: {},
  },
  schema: z.object({
    prefix: z.string().trim().min(1).max(5),
    logChannelId: z.string().nullable(),
    featureFlags: z.record(z.string(), z.boolean()),
  }),
});
```

The `key` namespaces this settings block in storage, allowing multiple independent setting groups.

## Registering as a service

```ts title="src/services/index.ts"
import { guildSettings } from "./settings";

export const services = {
  guildSettings,
};
```

## Reading and writing settings

```ts title="src/commands/set-prefix.ts"
import { defineCommand } from "@bight-ts/core";
import { SlashCommandBuilder } from "discord.js";

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("set-prefix")
    .setDescription("Change the bot prefix.")
    .addStringOption((o) =>
      o.setName("prefix").setDescription("New prefix").setRequired(true),
    ),

  async execute({ interaction, context }) {
    if (!interaction.guildId) return;

    const newPrefix = interaction.options.getString("prefix", true);

    await context.services.guildSettings.update(interaction.guildId, {
      prefix: newPrefix,
    });

    await interaction.reply(`Prefix updated to \`${newPrefix}\``);
  },
});
```

If the update violates the Zod schema (e.g, a 10-character prefix against a `max(5)` rule), the update throws a `SettingsValidationError`.

When reading settings with `.get(guildId)`, the stored values are overlaid on the defaults. Fields that haven't been set return their default values rather than `undefined`.
