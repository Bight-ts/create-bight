---
title: "@bight-ts/core — Diagnostics"
description: API reference for diagnostic events, the hub, sources, and snapshots.
---

```ts
import {
  createMemoryDiagnosticsHub,
  createCoreDiagnosticsSource,
  type BightDiagnosticEvent,
  type BightDiagnosticsHub,
  type BightDiagnosticsSource,
} from "@bight-ts/core";
```

## `createMemoryDiagnosticsHub(options?)`

Creates an in-memory diagnostics hub that records events and supports subscriptions.

| Option      | Type     | Default | Description                                |
| ----------- | -------- | ------- | ------------------------------------------ |
| `maxEvents` | `number` | `200`   | Maximum events retained in the ring buffer |

### `BightDiagnosticsHub<TServices>`

| Method           | Signature                                                     | Description                                                |
| ---------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| `record`         | `(event: BightDiagnosticEvent) => void`                       | Record an event                                            |
| `recent`         | `(limit?: number) => BightDiagnosticEvent[]`                  | Get recent events (newest first)                           |
| `subscribe`      | `(listener: (event) => void) => () => void`                   | Subscribe to live events. Returns an unsubscribe function. |
| `registerSource` | `(source: BightDiagnosticsSource) => void`                    | Register a named source for snapshot reporting             |
| `createSnapshot` | `(input: SnapshotInput) => Promise<BightDiagnosticsSnapshot>` | Collect a point-in-time report from all registered sources |

## Event types

All events include a `timestamp: string` (ISO 8601) field.

| Type                  | Key fields                                           | Emitted when                         |
| --------------------- | ---------------------------------------------------- | ------------------------------------ |
| `command_denied`      | `commandName`, `code`, `userId`, `preconditionName?` | A precondition blocks a command      |
| `command_error`       | `commandName`, `message`, `subcommandName?`          | A command handler throws             |
| `interaction_error`   | `kind`, `customId`, `message`                        | A button/modal/select handler throws |
| `plugin_loaded`       | `pluginName`                                         | A plugin completes setup             |
| `plugin_before_login` | `pluginName`                                         | A plugin completes `beforeLogin`     |
| `plugin_after_login`  | `pluginName`                                         | A plugin completes `afterLogin`      |
| `task_scheduled`      | `taskName`, `nextRunAt`, `delayMs`                   | A scheduled task is queued           |
| `task_started`        | `taskName`                                           | A scheduled task begins execution    |
| `task_succeeded`      | `taskName`, `finishedAt`                             | A scheduled task completes           |
| `task_failed`         | `taskName`, `message`, `finishedAt`                  | A scheduled task throws              |

## `createCoreDiagnosticsSource()`

Creates the built-in diagnostics source that reports core runtime stats (command count, handler counts, plugin list, etc). Automatically registered by `createBightApp()`.

## `BightDiagnosticsSource<TServices>`

Interface for custom diagnostic sources.

| Property   | Type                                                | Description                             |
| ---------- | --------------------------------------------------- | --------------------------------------- |
| `name`     | `string`                                            | Source identifier (unique per hub)      |
| `snapshot` | `(input: SnapshotInput) => Record<string, unknown>` | Returns a report object for this source |

## `BightDiagnosticsSnapshot`

| Property      | Type                                      | Description                         |
| ------------- | ----------------------------------------- | ----------------------------------- |
| `generatedAt` | `string`                                  | ISO 8601 timestamp                  |
| `pluginNames` | `string[]`                                | Active plugin names                 |
| `eventCount`  | `number`                                  | Total event listener count          |
| `sources`     | `Record<string, Record<string, unknown>>` | Reports from each registered source |

## Related

- [Diagnostics & Devtools](/ops-and-diagnostics/diagnostics/)
- [@bight-ts/plugin-devtools](/reference/packages/plugin-devtools/)
- [@bight-ts/plugin-ops](/reference/packages/plugin-ops/)
