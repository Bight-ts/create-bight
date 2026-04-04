---
title: "@bight-ts/settings"
description: API reference for typed guild settings and global settings with Zod validation.
---

```ts
import {
  createGuildSettingsService,
  createGlobalSettingService,
  SettingsValidationError,
} from "@bight-ts/settings";
```

## `createGuildSettingsService(options)`

Creates a typed, validated per-guild settings service backed by the storage facade.

### `CreateGuildSettingsServiceOptions<TSettings>`

| Property   | Type                            | Required | Description                                                            |
| ---------- | ------------------------------- | -------- | ---------------------------------------------------------------------- |
| `storage`  | `StorageContext`                | Yes      | The storage facade from `createStorage()`                              |
| `key`      | `string`                        | Yes      | Namespace key in storage (allows multiple independent settings blocks) |
| `defaults` | `TSettings`                     | Yes      | Default values for all fields                                          |
| `schema`   | `z.ZodType<TSettings>`          | No       | Zod schema for validation on read and write                            |
| `migrate`  | `(value: unknown) => TSettings` | No       | Migration function for stored values from older formats                |

### `GuildSettingsService<TSettings>`

| Method   | Signature                                                            | Description                                         |
| -------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| `get`    | `(guildId: string) => Promise<TSettings>`                            | Read settings, overlaying stored values on defaults |
| `update` | `(guildId: string, patch: Partial<TSettings>) => Promise<TSettings>` | Merge partial updates into existing settings        |
| `set`    | `(guildId: string, value: TSettings) => Promise<TSettings>`          | Replace all settings for a guild                    |
| `reset`  | `(guildId: string) => Promise<TSettings>`                            | Reset to defaults                                   |

## `createGlobalSettingService(options)`

Creates a typed global (non-guild-scoped) setting.

### `CreateGlobalSettingServiceOptions<TValue>`

| Property       | Type                         | Required | Description        |
| -------------- | ---------------------------- | -------- | ------------------ |
| `storage`      | `StorageContext`             | Yes      | The storage facade |
| `key`          | `string`                     | Yes      | Storage key        |
| `defaultValue` | `TValue`                     | Yes      | Default value      |
| `schema`       | `z.ZodType<TValue>`          | No       | Zod schema         |
| `migrate`      | `(value: unknown) => TValue` | No       | Migration function |

### `GlobalSettingService<TValue>`

| Method  | Signature                            | Description                               |
| ------- | ------------------------------------ | ----------------------------------------- |
| `get`   | `() => Promise<TValue>`              | Read the value (returns default if unset) |
| `set`   | `(value: TValue) => Promise<TValue>` | Write the value                           |
| `reset` | `() => Promise<TValue>`              | Reset to default                          |

## `SettingsValidationError`

Thrown when a Zod schema rejects a settings value during `get`, `update`, or `set`. Extends `Error` with `name: "SettingsValidationError"`.

## Related

- [Guild Settings](/advanced-features/guild-settings/)
- [Settings & Data Strategy](/storage-and-data/settings-and-data/)
- [@bight-ts/core Storage](/reference/core/storage/)
