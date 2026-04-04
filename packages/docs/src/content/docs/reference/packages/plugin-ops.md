---
title: "@bight-ts/plugin-ops"
description: API reference for startup checks, maintenance mode, and error reporting plugins.
---

```ts
import {
  createErrorReporterPlugin,
  createMaintenanceModePlugin,
  createStartupChecksPlugin,
} from "@bight-ts/plugin-ops";
```

## `createStartupChecksPlugin(options)`

Validates environment variables, intents, and services before the bot connects to Discord.

### Options

| Property           | Type                  | Required | Description                                                 |
| ------------------ | --------------------- | -------- | ----------------------------------------------------------- |
| `requiredEnv`      | `string[]`            | No       | Environment variables that must be defined                  |
| `requiredIntents`  | `GatewayIntentBits[]` | No       | Intents that must be present on the client                  |
| `requiredServices` | `{ name, get }[]`     | No       | Service accessors to check for truthiness                   |
| `mode`             | `"fail" \| "warn"`    | No       | Whether to throw or just log warnings. Defaults to `"fail"` |
| `enabled`          | `boolean`             | No       | Toggle the plugin                                           |

## `createMaintenanceModePlugin(options)`

Injects a global precondition that blocks all interactions when active.

### Options

| Property         | Type                                        | Required | Description                                                   |
| ---------------- | ------------------------------------------- | -------- | ------------------------------------------------------------- |
| `getState`       | `(context) => Promise<{ active: boolean }>` | Yes      | Reads the current maintenance state                           |
| `setState`       | `(context, state) => Promise<void>`         | Yes      | Persists a new maintenance state                              |
| `includeCommand` | `boolean`                                   | No       | Register a `/maintenance` toggle command. Defaults to `false` |
| `allowedUserIds` | `string[]`                                  | No       | User IDs that bypass maintenance mode                         |
| `message`        | `string`                                    | No       | Custom denial message                                         |
| `enabled`        | `boolean`                                   | No       | Toggle the plugin                                             |

## `createErrorReporterPlugin(options)`

Subscribes to diagnostic events and forwards errors to an external reporter.

### Options

| Property                   | Type                         | Required | Description                                         |
| -------------------------- | ---------------------------- | -------- | --------------------------------------------------- |
| `getReporter`              | `(context) => ErrorReporter` | Yes      | Returns your error reporting service                |
| `includeCommandErrors`     | `boolean`                    | No       | Forward command errors. Defaults to `true`          |
| `includeInteractionErrors` | `boolean`                    | No       | Forward interaction errors. Defaults to `true`      |
| `includeTaskFailures`      | `boolean`                    | No       | Forward scheduled task failures. Defaults to `true` |
| `enabled`                  | `boolean`                    | No       | Toggle the plugin                                   |

## Related

- [Startup Checks](/ops-and-diagnostics/startup-checks/)
- [Maintenance Mode](/ops-and-diagnostics/maintenance-mode/)
- [Error Reporting](/ops-and-diagnostics/error-reporting/)
