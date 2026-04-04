---
title: Drizzle Storage
description: Store Bight's internal state alongside your Drizzle-managed tables.
---

`@bight-ts/storage-drizzle` lets Bight persist its framework state using Drizzle tables, keeping everything in the same database your app already uses.

## Table definitions

The package provides table helpers for each SQL dialect:

```ts title="src/db/bight-tables.ts"
import { createPostgresStorageTables } from "@bight-ts/storage-drizzle";
// Also available: createSqliteStorageTables, createMysqlStorageTables

export const bightTables = createPostgresStorageTables();
// Creates: global_configs (key TEXT PK, value TEXT)
//          guild_configs (guild_id TEXT PK, value TEXT)
```

Pass an optional prefix to namespace the table names: `createPostgresStorageTables("bight")` creates `bight_global_configs` and `bight_guild_configs`.

Add these tables to your Drizzle schema and run migrations.

## Adapter setup

```ts title="src/storage/adapter.ts"
import { createDrizzleStorageAdapter } from "@bight-ts/storage-drizzle";
import { createStorage } from "@bight-ts/core";
import { db } from "../services/db";
import { bightTables } from "../db/bight-tables";

const adapter = createDrizzleStorageAdapter({
  db,
  tables: bightTables,
});

export const storage = createStorage(adapter);
```

Values are serialized as JSON strings. You can provide custom `serialize` and `deserialize` functions if needed.

## Domain data

This adapter handles Bight's framework state only. For your app's domain queries, use Drizzle directly through [services](/architecture/services/): `context.services.db.select().from(users).where(...)`. See [Settings & Data Strategy](/storage-and-data/settings-and-data/).
