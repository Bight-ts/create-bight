---
title: "@bight-ts/plugin-message-commands"
description: API reference for the message commands plugin.
---

```ts
import {
  createMessageCommandsPlugin,
  defineMessageCommand,
} from "@bight-ts/plugin-message-commands";
```

## `createMessageCommandsPlugin(options)`

Registers message-based command handlers that trigger on chat messages.

### Options

| Property   | Type               | Required | Description                                   |
| ---------- | ------------------ | -------- | --------------------------------------------- |
| `commands` | `MessageCommand[]` | Yes      | Array of message command definitions          |
| `enabled`  | `boolean`          | No       | Toggle the plugin                             |
| `name`     | `string`           | No       | Plugin name. Defaults to `"message-commands"` |

## `defineMessageCommand(command)`

Defines a command that matches against chat messages.

### `MessageCommand<TServices>`

| Property        | Type                                       | Required | Description                                              |
| --------------- | ------------------------------------------ | -------- | -------------------------------------------------------- |
| `data`          | `{ name: string, description: string }`    | Yes      | Command metadata (used in diagnostics, not Discord UI)   |
| `match`         | `(input: { message, context }) => boolean` | Yes      | Returns `true` if this command should handle the message |
| `execute`       | `(input: { message, context }) => void`    | Yes      | The command handler                                      |
| `preconditions` | `string[]`                                 | No       | Named preconditions                                      |
| `onDenied`      | `BightDeniedHandler`                       | No       | Custom denial handler                                    |

## Behavior

- Commands are evaluated in declaration order. The first `match` that returns `true` wins.
- Requires `GuildMessages` and `MessageContent` gateway intents.
- Errors and denials are recorded as diagnostic events.

## Related

- [Message Commands](/commands-and-interactions/message-commands/)
- [Gateway Intents](/architecture/gateway-intents/)
