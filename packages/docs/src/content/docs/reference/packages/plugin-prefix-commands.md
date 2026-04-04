---
title: "@bight-ts/plugin-prefix-commands"
description: API reference for the prefix commands plugin.
---

```ts
import {
  createPrefixCommandsPlugin,
  definePrefixCommand,
} from "@bight-ts/plugin-prefix-commands";
```

## `createPrefixCommandsPlugin(options)`

Registers prefix-based command handlers that trigger on chat messages starting with a configured prefix.

### Options

| Property      | Type                                        | Required | Description                                                            |
| ------------- | ------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `commands`    | `PrefixCommand[]`                           | Yes      | Array of prefix command definitions                                    |
| `getPrefixes` | `(input: { context, message }) => string[]` | Yes      | Resolves the active prefixes per-message (supports per-guild prefixes) |
| `enabled`     | `boolean`                                   | No       | Toggle the plugin                                                      |
| `name`        | `string`                                    | No       | Plugin name. Defaults to `"prefix-commands"`                           |

## `definePrefixCommand(command)`

Defines a command that matches after the prefix is stripped.

### `PrefixCommand<TServices>`

| Property        | Type                                                    | Required | Description                                                                          |
| --------------- | ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `data`          | `{ name: string, description: string }`                 | Yes      | Command metadata                                                                     |
| `execute`       | `(input: { message, context, args: string[] }) => void` | Yes      | The command handler. `args` contains whitespace-split tokens after the command name. |
| `preconditions` | `string[]`                                              | No       | Named preconditions                                                                  |
| `onDenied`      | `BightDeniedHandler`                                    | No       | Custom denial handler                                                                |

## Behavior

- After a message matches a prefix, the remaining text is split by whitespace to identify the command name and arguments.
- Requires `GuildMessages` and `MessageContent` gateway intents.
- Errors and denials are recorded as diagnostic events.

## Related

- [Prefix Commands](/commands-and-interactions/prefix-commands/)
- [Gateway Intents](/architecture/gateway-intents/)
