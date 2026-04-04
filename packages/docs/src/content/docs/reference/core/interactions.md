---
title: "@bight-ts/core — Interactions"
description: API reference for button, modal, and select menu handlers.
---

```ts
import {
  defineButtonHandler,
  defineModalHandler,
  defineSelectMenuHandler,
} from "@bight-ts/core";
```

## Handler types

All three handler types share the same structure — they differ only in the interaction type passed to `execute`.

### `ButtonHandler<TServices>`

| Property         | Type                                                           | Required                              | Description                               |
| ---------------- | -------------------------------------------------------------- | ------------------------------------- | ----------------------------------------- |
| `customId`       | `string`                                                       | One of `customId` or `customIdPrefix` | Exact custom ID match                     |
| `customIdPrefix` | `string`                                                       | One of `customId` or `customIdPrefix` | Prefix-based match for dynamic custom IDs |
| `execute`        | `(input: { interaction: ButtonInteraction, context }) => void` | Yes                                   | The button handler                        |
| `preconditions`  | `string[]`                                                     | No                                    | Named preconditions                       |
| `onDenied`       | `BightDeniedHandler`                                           | No                                    | Custom denial handler                     |

### `ModalHandler<TServices>`

| Property         | Type                                                                | Required                              | Description           |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------- | --------------------- |
| `customId`       | `string`                                                            | One of `customId` or `customIdPrefix` | Exact custom ID match |
| `customIdPrefix` | `string`                                                            | One of `customId` or `customIdPrefix` | Prefix-based match    |
| `execute`        | `(input: { interaction: ModalSubmitInteraction, context }) => void` | Yes                                   | The modal handler     |
| `preconditions`  | `string[]`                                                          | No                                    | Named preconditions   |
| `onDenied`       | `BightDeniedHandler`                                                | No                                    | Custom denial handler |

### `SelectMenuHandler<TServices>`

| Property         | Type                                                                     | Required                              | Description             |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------- | ----------------------- |
| `customId`       | `string`                                                                 | One of `customId` or `customIdPrefix` | Exact custom ID match   |
| `customIdPrefix` | `string`                                                                 | One of `customId` or `customIdPrefix` | Prefix-based match      |
| `execute`        | `(input: { interaction: StringSelectMenuInteraction, context }) => void` | Yes                                   | The select menu handler |
| `preconditions`  | `string[]`                                                               | No                                    | Named preconditions     |
| `onDenied`       | `BightDeniedHandler`                                                     | No                                    | Custom denial handler   |

## `RoutedInteractionExecution<TInteraction, TServices>`

Passed to all handler `execute` functions.

| Property      | Type                      | Description                                                                                               |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `interaction` | `TInteraction`            | The Discord interaction (`ButtonInteraction`, `ModalSubmitInteraction`, or `StringSelectMenuInteraction`) |
| `context`     | `BightContext<TServices>` | Your app context                                                                                          |

## Routing behavior

- **Exact match** (`customId`): The handler fires only when the interaction's custom ID matches exactly.
- **Prefix match** (`customIdPrefix`): The handler fires for any custom ID that starts with the prefix. Use with [Custom IDs](/reference/core/custom-ids/) for dynamic data.
- Global preconditions apply to all routed interactions.
- Errors are recorded as `interaction_error` events in [diagnostics](/ops-and-diagnostics/diagnostics/).

## Related

- [Buttons, Modals & Selects](/commands-and-interactions/buttons-modals-selects/)
- [Preconditions & Denials](/commands-and-interactions/preconditions-and-denied/)
- [@bight-ts/core Custom IDs](/reference/core/custom-ids/)
