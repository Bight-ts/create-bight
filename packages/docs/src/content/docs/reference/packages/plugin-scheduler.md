---
title: "@bight-ts/plugin-scheduler"
description: API reference for the persistent scheduler plugin.
---

```ts
import {
  createSchedulerPlugin,
  createStorageSchedulerStore,
  defineScheduledTask,
} from "@bight-ts/plugin-scheduler";
```

## `createSchedulerPlugin(options)`

Registers and manages persistent recurring tasks.

### Options

| Property      | Type                          | Required | Description                                                     |
| ------------- | ----------------------------- | -------- | --------------------------------------------------------------- |
| `tasks`       | `ScheduledTask[]`             | Yes      | Array of task definitions                                       |
| `store`       | `(context) => SchedulerStore` | No       | Persistence backend. Without it, task timing resets on restart. |
| `enabled`     | `boolean`                     | No       | Toggle the plugin                                               |
| `name`        | `string`                      | No       | Plugin name. Defaults to `"scheduler"`                          |
| `loggerScope` | `string`                      | No       | Logger scope. Defaults to `"scheduler"`                         |

## `defineScheduledTask(task)`

Defines a recurring task.

### `ScheduledTask<TServices>`

| Property     | Type                           | Required | Description                                  |
| ------------ | ------------------------------ | -------- | -------------------------------------------- |
| `name`       | `string`                       | Yes      | Unique task identifier                       |
| `intervalMs` | `number`                       | Yes      | Milliseconds between runs                    |
| `runOnStart` | `boolean`                      | No       | Run immediately on boot. Defaults to `false` |
| `run`        | `(input: { context }) => void` | Yes      | Task handler                                 |

## `createStorageSchedulerStore(storage)`

Creates a scheduler store backed by Bight's storage facade. Persists task timestamps so the scheduler resumes from the correct point after a restart.

| Parameter | Type             | Description                               |
| --------- | ---------------- | ----------------------------------------- |
| `storage` | `StorageContext` | The storage facade from `createStorage()` |

## Diagnostic events

The scheduler emits these events to the [diagnostics hub](/reference/core/diagnostics/):

| Event            | When                                               |
| ---------------- | -------------------------------------------------- |
| `task_scheduled` | Task is queued with a computed `nextRunAt`         |
| `task_started`   | Task begins execution                              |
| `task_succeeded` | Task completes without error                       |
| `task_failed`    | Task throws (captured, does not crash the runtime) |

## Related

- [Persistent Scheduler](/advanced-features/persistent-scheduler/)
- [Diagnostics & Devtools](/ops-and-diagnostics/diagnostics/)
