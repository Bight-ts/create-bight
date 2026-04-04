---
title: Preconditions & Denials
description: Reusable access-control rules that run before command execution.
---

Preconditions extract access-control logic (admin checks, cooldowns, feature flags) out of your command handlers. They run before `execute()` is called, keeping your business logic clean.

## Creating a precondition

```ts title="src/preconditions/admin-only.ts"
import { createAdministratorPrecondition } from "@bight-ts/core";

export default createAdministratorPrecondition();
```

Bight ships several factories for common checks:

| Factory                               | Default name                | Checks                                      |
| ------------------------------------- | --------------------------- | ------------------------------------------- |
| `createAdministratorPrecondition()`   | `administrator-only`        | User has the Administrator permission       |
| `createGuildOnlyPrecondition()`       | `guild-only`                | Command was used in a guild (not DM)        |
| `createOwnerOnlyPrecondition()`       | `owner-only`                | User ID is in the `ownerIds` list           |
| `createUserPermissionsPrecondition()` | `required-user-permissions` | User has all specified permissions          |
| `createDevelopmentOnlyPrecondition()` | `development-only`          | App is running in a development environment |

For custom logic, use `definePrecondition`:

```ts title="src/preconditions/premium-only.ts"
import { definePrecondition } from "@bight-ts/core";

export default definePrecondition({
  name: "premium-only",
  async check({ interaction, context }) {
    const user = await context.services.db.user.findUnique({
      where: { discordId: interaction?.user.id },
    });

    if (!user?.isPremium) {
      return "This command requires a premium subscription.";
    }

    return true;
  },
});
```

Return `true` to allow, or a `string` to deny with a message.

## Applying to commands

Reference preconditions by name in the `preconditions` array:

```ts title="src/commands/reload.ts"
import { SlashCommandBuilder } from "discord.js";
import { defineCommand } from "@bight-ts/core";

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload state."),
  preconditions: ["administrator-only"],

  async execute({ interaction }) {
    await interaction.reply("Reloading...");
  },
});
```

## Global vs local preconditions

The examples above are **local preconditions**. They only apply to a single command or handler.

**Global preconditions** apply to every incoming interaction. Register them through a plugin's `setup` hook by calling `addGlobalPrecondition()`.

```ts title="src/plugins/maintenance/index.ts"
import { definePlugin, definePrecondition } from "@bight-ts/core";

const maintenancePrecondition = definePrecondition({
  name: "global-maintenance",
  check: ({ context }) => {
    if (context.services.maintenance.isActive()) {
      return "The bot is currently undergoing maintenance.";
    }
    return true;
  },
});

export default definePlugin({
  name: "maintenance",
  setup: (registry) => {
    registry.addGlobalPrecondition(
      "global-maintenance",
      maintenancePrecondition,
    );
  },
});
```

See [Maintenance Mode](/ops-and-diagnostics/maintenance-mode/) for a better way to handle this specific use-case.

## Handling denials

When a precondition fails, Bight sends a default ephemeral reply to the user. To customize this behavior, provide an `onDenied` handler:

```ts title="src/commands/premium-feature.ts"
import { defineCommand } from "@bight-ts/core";
import { SlashCommandBuilder, MessageFlags } from "discord.js";

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("premium-feature")
    .setDescription("A premium-only command."),
  preconditions: ["premium-only"],

  onDenied: async ({ interaction, reason, reply }) => {
    if (reason.preconditionName === "premium-only") {
      await reply(
        "Upgrade to premium to unlock this feature: <https://example.com/upgrade>",
      );
      return;
    }

    await reply(); // fall back to default behavior
  },

  async execute({ interaction }) {
    await interaction.reply("Running premium feature...");
  },
});
```

The `onDenied` handler receives the denial `reason` (including the precondition name and message), a `reply()` helper, and a `suppress()` function to silently drop the denial.
