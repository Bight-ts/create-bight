---
title: "@bight-ts/storage-drizzle"
description: API reference for the Drizzle ORM storage adapter and table helpers.
---

```ts
import {
  createDrizzleStorageAdapter,
  createSqliteStorageTables,
  createPostgresStorageTables,
  createMysqlStorageTables,
} from "@bight-ts/storage-drizzle";
```

## `createDrizzleStorageAdapter(options)`

Creates a `StorageAdapter` that persists Bight state in Drizzle-managed SQL tables.

### `DrizzleStorageAdapterOptions`

| Property      | Type                              | Required | Description                                     |
| ------------- | --------------------------------- | -------- | ----------------------------------------------- |
| `db`          | Drizzle database instance         | Yes      | Your Drizzle DB client                          |
| `tables`      | `{ globalConfigs, guildConfigs }` | Yes      | Table references (from the helpers below)       |
| `serialize`   | `(value: StorageValue) => string` | No       | Custom serializer. Defaults to `JSON.stringify` |
| `deserialize` | `(value: string) => StorageValue` | No       | Custom deserializer. Defaults to `JSON.parse`   |

## Table helpers

Each helper creates two Drizzle tables: `global_configs` (key → value) and `guild_configs` (guild_id → value).

| Function                               | SQL dialect | Column types                               |
| -------------------------------------- | ----------- | ------------------------------------------ |
| `createSqliteStorageTables(prefix?)`   | SQLite      | `TEXT`                                     |
| `createPostgresStorageTables(prefix?)` | PostgreSQL  | `TEXT`                                     |
| `createMysqlStorageTables(prefix?)`    | MySQL       | `VARCHAR(191)` for keys, `TEXT` for values |

The optional `prefix` argument namespaces table names: `createPostgresStorageTables("bight")` creates `bight_global_configs` and `bight_guild_configs`.

### Behavior

- Values are serialized as JSON strings into the `value` column.
- Upserts use `onConflictDoUpdate` (SQLite/Postgres) or `onDuplicateKeyUpdate` (MySQL).

## Related

- [Drizzle Storage](/storage-and-data/drizzle/)
- [Choosing a Storage Backend](/storage-and-data/choosing-a-backend/)
