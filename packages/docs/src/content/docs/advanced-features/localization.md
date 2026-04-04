---
title: Localization (i18n)
description: Reply in the user's language using the i18n service.
---

Discord includes the user's locale in every interaction payload. The `@bight-ts/i18n` package provides a service-first translation layer that resolves strings based on this locale.

## Defining the catalog

```ts title="src/i18n/catalog.ts"
export const catalog = {
  en: {
    "commands.hello.reply": "Hello to you too!",
    "commands.hello.description": "Say hello.",
  },
  es: {
    "commands.hello.reply": "¡Hola a ti también!",
    "commands.hello.description": "Saluda.",
  },
};
```

## Registering the service

```ts title="src/services/index.ts"
import { createI18nService } from "@bight-ts/i18n";
import { catalog } from "../i18n/catalog";

export const services = {
  i18n: createI18nService({
    catalog,
    defaultLocale: "en",
  }),
};
```

## Using in commands

```ts title="src/commands/hello.ts"
import { defineCommand } from "@bight-ts/core";
import { SlashCommandBuilder } from "discord.js";

export default defineCommand({
  data: new SlashCommandBuilder().setName("hello").setDescription("Say hello."),

  async execute({ interaction, context }) {
    const t = context.services.i18n.forInteraction(interaction);

    await interaction.reply({
      content: t.t("commands.hello.reply"),
    });
  },
});
```

`forInteraction()` extracts the user's locale from the interaction and returns a scoped translator. If a key is missing for the requested locale, it falls back to `defaultLocale`.
