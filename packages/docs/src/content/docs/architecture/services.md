---
title: Services
description: Expose your app's external integrations through explicit, testable service objects.
---

Services are your app-owned integrations. Database clients, cache layers, error reporters, localization engines, you name it.

They live in `src/services/` and are passed to every command and interaction handler through the `context` object.

## Defining services

```ts title="src/services/index.ts"
import { PrismaClient } from "@prisma/client";
import { MyCustomLogger } from "./logger";

export const services = {
  prisma: new PrismaClient(),
  logger: new MyCustomLogger(),
};

export type AppServices = typeof services;
```

> Bight infers the service types automatically, so no manual type registration is required.

## Using services in commands

```ts title="src/commands/stats.ts"
import { defineCommand } from "@bight-ts/core";
import { SlashCommandBuilder } from "discord.js";

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Show user stats."),

  async execute({ interaction, context }) {
    const user = await context.services.prisma.user.findFirst({
      where: { discordId: interaction.user.id },
    });

    await interaction.reply(`Found user: ${user?.name ?? "unknown"}`);
  },
});
```

`context.services` is fully typed. Your editor will autocomplete through `prisma`, `logger`, or whatever you defined.

## Testing

Because services are a plain object passed through `context`, testing a command doesn't require framework setup:

```ts title="tests/commands/stats.test.ts"
import { describe, it, expect, vi } from "vitest";

const mockContext = {
  services: {
    prisma: {
      user: {
        findFirst: vi.fn().mockResolvedValue({ name: "Alice" }),
      },
    },
  },
};

// Pass mockContext into your command's execute() to test it in isolation
```

No container overrides, no framework boot. The explicit service boundary makes this straightforward.

## When to use services vs plugins

**Services** are dependencies you call directly: `context.services.db.query(...)`. They're passive, your code is the one that reaches into them.

**Plugins** are lifecycle hooks that run around your code: startup checks, schedulers, global preconditions. They're active, they do things without being called. See [Plugins](/architecture/plugins/).
