---
title: "@bight-ts/plugin-devtools"
description: API reference for the devtools plugin.
---

```ts
import {
  createDevtoolsPlugin,
  type DevtoolsPluginOptions,
} from "@bight-ts/plugin-devtools";
```

## `createDevtoolsPlugin(options?)`

Registers an in-Discord diagnostics command with three subcommands: `status`, `events`, and `reports`.

### `DevtoolsPluginOptions<TServices>`

| Property             | Type       | Default               | Description                                   |
| -------------------- | ---------- | --------------------- | --------------------------------------------- |
| `commandName`        | `string`   | `"bight-devtools"`    | Name of the registered slash command          |
| `devOnly`            | `boolean`  | `true`                | Block the command in production environments  |
| `preconditions`      | `string[]` | —                     | Preconditions applied to the devtools command |
| `recentEventLimit`   | `number`   | `10`                  | Max events shown in the `/events` subcommand  |
| `logStartupSnapshot` | `boolean`  | `true` in development | Log a diagnostics snapshot after login        |
| `includeCommand`     | `boolean`  | `true`                | Whether to register the slash command at all  |
| `enabled`            | `boolean`  | `true`                | Toggle the entire plugin                      |
| `name`               | `string`   | `"devtools"`          | Plugin name for diagnostics                   |
| `loggerScope`        | `string`   | `"devtools"`          | Logger scope                                  |

### Subcommands

| Subcommand | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| `status`   | Runtime summary: bot tag, command/handler counts, loaded plugins |
| `events`   | Recent diagnostic events (denials, errors, task results)         |
| `reports`  | Structured snapshot from all registered diagnostic sources       |

## Related

- [Diagnostics & Devtools](/ops-and-diagnostics/diagnostics/)
- [@bight-ts/core Diagnostics](/reference/core/diagnostics/)
