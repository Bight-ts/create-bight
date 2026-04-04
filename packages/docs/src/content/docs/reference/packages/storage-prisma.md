---
title: "@bight-ts/storage-prisma"
description: API reference for the Prisma storage adapter.
---

```ts
import { createPrismaStorageAdapter } from "@bight-ts/storage-prisma";
```

## `createPrismaStorageAdapter(options)`

Creates a `StorageAdapter` that persists Bight state using Prisma model delegates.

### `PrismaStorageAdapterOptions`

| Property        | Type            | Required | Description                                                                                                                                               |
| --------------- | --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `globalConfigs` | Prisma delegate | Yes      | A Prisma model delegate (e.g, `prisma.globalConfig`) with `findUnique` and `upsert` methods. Model must have a `key: String @id` and `value: Json` field. |
| `guildConfigs`  | Prisma delegate | Yes      | A Prisma model delegate with `findUnique` and `upsert`. Model must have a `guildId: String @id` and `value: Json` field.                                  |

### Required Prisma schema

```prisma
model GlobalConfig {
  key   String @id
  value Json
}

model GuildConfig {
  guildId String @id @map("guild_id")
  value   Json
}
```

### Behavior

- Global values are stored as individual rows keyed by `key`.
- Guild values are stored as a single JSON object per guild, keyed by `guildId`.
- The adapter uses `findUnique` + `upsert` — no raw SQL.

## Related

- [Prisma Storage](/storage-and-data/prisma/)
- [Choosing a Storage Backend](/storage-and-data/choosing-a-backend/)
