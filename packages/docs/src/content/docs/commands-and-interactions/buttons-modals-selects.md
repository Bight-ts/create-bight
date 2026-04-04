---
title: Buttons, Modals & Selects
description: Handle component interactions with typed custom IDs and dedicated handler files.
---

Buttons, modals, and select menus fire interactions that are disconnected from the command that created them. Bight routes these through dedicated handler files in `src/interactions/`, matched by custom ID.

## Defining a typed custom ID

Instead of hardcoding strings like `"feedback_modal_123"`, define a structured ID that enforces type safety across builder and handler:

```ts title="src/interactions/ids.ts"
import { defineCustomId } from "@bight-ts/core";

export const feedbackId = defineCustomId({
  prefix: "feedback",
  fields: ["ticketId"] as const,
});
```

This gives you:

- `feedbackId.build({ ticketId: "abc" })` -> `"feedback:abc"`
- `feedbackId.parse("feedback:abc")` -> `{ ticketId: "abc" }`
- `feedbackId.customIdPrefix` -> `"feedback:"` (for routing)

## Handling a button click

```ts title="src/interactions/buttons/open-feedback.ts"
import { defineButtonHandler } from "@bight-ts/core";
import { feedbackId } from "../ids";

export default defineButtonHandler({
  customIdPrefix: feedbackId.customIdPrefix,

  async execute({ interaction }) {
    const parsed = feedbackId.parse(interaction.customId);
    if (!parsed) return;

    // parsed.ticketId is fully typed
    await interaction.showModal(/* build modal with parsed.ticketId */);
  },
});
```

## Handling a modal submission

```ts title="src/interactions/modals/submit-feedback.ts"
import { defineModalHandler } from "@bight-ts/core";

export default defineModalHandler({
  customIdPrefix: "feedback:submit:",

  async execute({ interaction }) {
    const message = interaction.fields.getTextInputValue("message");
    await interaction.reply(`Received: ${message}`);
  },
});
```

## Handling a select menu

```ts title="src/interactions/selects/pick-category.ts"
import { defineSelectMenuHandler } from "@bight-ts/core";

export default defineSelectMenuHandler({
  customIdPrefix: "category:",

  async execute({ interaction }) {
    const selected = interaction.values[0];
    await interaction.reply(`You picked: ${selected}`);
  },
});
```

## Routing modes

Handlers can match by exact ID or prefix:

| Property                      | Match behavior                          |
| ----------------------------- | --------------------------------------- |
| `customId: "feedback:submit"` | Exact match only                        |
| `customIdPrefix: "feedback:"` | Matches any ID starting with the prefix |

Use exact match when the custom ID is static. Use prefix match when the ID contains dynamic data (like a ticket ID or user ID encoded via `defineCustomId`).

## Preconditions on interactions

Button, modal, and select handlers support the same `preconditions` and `onDenied` properties as [slash commands](/commands-and-interactions/preconditions-and-denied/). Global preconditions also apply to all routed interactions.
