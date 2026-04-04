---
title: Persistent Scheduler
description: Run recurring tasks that survive bot restarts.
---

Node.js `setInterval()` and `setTimeout()` timers are lost when the process restarts. The `@bight-ts/plugin-scheduler` plugin persists task state through Bight's [storage layer](/storage-and-data/settings-and-data/), resuming tasks where they left off after a reboot.

## Defining a task

```ts title="src/tasks/heartbeat.ts"
import { defineScheduledTask } from "@bight-ts/plugin-scheduler";

export const heartbeatTask = defineScheduledTask({
  name: "heartbeat",
  intervalMs: 60_000,
  runOnStart: true,

  async run({ context }) {
    context.logger.debug("Scheduler heartbeat ran.");
  },
});
```

| Option       | Type      | Description                                             |
| ------------ | --------- | ------------------------------------------------------- |
| `name`       | `string`  | Unique identifier for the task                          |
| `intervalMs` | `number`  | Milliseconds between runs                               |
| `runOnStart` | `boolean` | Run immediately on boot, or wait for the first interval |
| `run`        | Function  | The task logic, receives `context`                      |

## Registering the plugin

```ts title="src/plugins/scheduler.ts"
import {
  createSchedulerPlugin,
  createStorageSchedulerStore,
} from "@bight-ts/plugin-scheduler";
import { heartbeatTask } from "../tasks/heartbeat";

export const schedulerPlugin = createSchedulerPlugin({
  tasks: [heartbeatTask],
  store: (context) => createStorageSchedulerStore(context.services.storage),
});
```

The `store` option connects the scheduler to Bight's storage layer for persistence. Without it, task timing resets on every restart.

Add to `src/plugins/index.ts`. Scheduled tasks are visible in the [devtools](/ops-and-diagnostics/diagnostics/) plugin under the Reports view.

## Diagnostics

The scheduler emits diagnostic events (`task_scheduled`, `task_started`, `task_succeeded`, `task_failed`) that are recorded by the [diagnostics hub](/ops-and-diagnostics/diagnostics/). Task failures are captured without crashing the runtime.
