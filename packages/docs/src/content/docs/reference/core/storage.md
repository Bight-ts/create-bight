---
title: "@bight-ts/core — Storage"
description: API reference for the storage adapter contract, facade, and store interfaces.
---

```ts
import {
  createStorage,
  type StorageAdapter,
  type StorageContext,
} from "@bight-ts/core";
```

## `createStorage(adapter)`

Wraps a `StorageAdapter` in a `StorageContext` with `global` and `guilds` stores.

## `StorageAdapter`

The interface that all storage backends implement.

| Method        | Signature                                                      | Description                            |
| ------------- | -------------------------------------------------------------- | -------------------------------------- |
| `getGlobal`   | `<T>(key: string) => Promise<T \| undefined>`                  | Read a global value                    |
| `setGlobal`   | `<T>(key: string, value: T) => Promise<void>`                  | Write a global value                   |
| `getGuild`    | `<T>(guildId: string, key: string) => Promise<T \| undefined>` | Read a guild-scoped value              |
| `setGuild`    | `<T>(guildId: string, key: string, value: T) => Promise<void>` | Write a guild-scoped value             |
| `patchGuild`  | `<T>(guildId: string, patch: Partial<T>) => Promise<T>`        | Shallow-merge into guild state         |
| `ensureGuild` | `<T>(guildId: string, defaults: T) => Promise<T>`              | Overlay defaults under existing values |

## `StorageContext`

Returned by `createStorage()`. The high-level API your code uses.

| Property  | Type                | Description                        |
| --------- | ------------------- | ---------------------------------- |
| `adapter` | `StorageAdapter`    | The raw adapter (for advanced use) |
| `global`  | `GlobalConfigStore` | Global key-value store             |
| `guilds`  | `GuildConfigStore`  | Guild-scoped key-value store       |

### `GlobalConfigStore`

| Method | Signature                                     |
| ------ | --------------------------------------------- |
| `get`  | `<T>(key: string) => Promise<T \| undefined>` |
| `set`  | `<T>(key: string, value: T) => Promise<void>` |

### `GuildConfigStore`

| Method   | Signature                                      | Notes                                                                     |
| -------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| `get`    | `<T>(guildId, key) => Promise<T \| undefined>` |                                                                           |
| `set`    | `<T>(guildId, key, value) => Promise<void>`    |                                                                           |
| `patch`  | `<T>(guildId, patch) => Promise<T>`            | Shallow merge — existing keys are overwritten, missing keys are preserved |
| `ensure` | `<T>(guildId, defaults) => Promise<T>`         | Defaults fill in missing keys without overwriting existing values         |

## `StorageValue`

The types the storage layer can persist: `string | number | boolean | null | StorageValue[] | { [key: string]: StorageValue }`.

## Related

- [Settings & Data Strategy](/storage-and-data/settings-and-data/)
- [@bight-ts/settings](/reference/packages/settings/)
- [Choosing a Storage Backend](/storage-and-data/choosing-a-backend/)
