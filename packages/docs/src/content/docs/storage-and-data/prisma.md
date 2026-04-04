---
title: Prisma Storage
description: Store Bight's internal state alongside your Prisma-managed tables.
---

`@bight-ts/storage-prisma` lets Bight persist its framework state using Prisma model delegates, keeping everything in the same database your app already uses.

## Schema

Add two models for Bight's internal storage:

```prisma title="prisma/schema.prisma"
model GlobalConfig {
  key   String @id
  value Json
}

model GuildConfig {
  guildId String @id @map("guild_id")
  value   Json
}
```

Run `prisma migrate dev` to apply.

## Adapter setup

```ts title="src/storage/adapter.ts"
import { createPrismaStorageAdapter } from "@bight-ts/storage-prisma";
import { createStorage } from "@bight-ts/core";
import { prisma } from "../services/prisma";

const adapter = createPrismaStorageAdapter({
  globalConfigs: prisma.globalConfig,
  guildConfigs: prisma.guildConfig,
});

export const storage = createStorage(adapter);
```

The adapter expects Prisma delegates with `findUnique` and `upsert`. Standard on any Prisma model.

## Domain data

This adapter handles Bight's framework state only. For your app's domain queries (users, logs, game state), use the Prisma client directly through [services](/architecture/services/): `context.services.prisma.user.findMany(...)`. See [Settings & Data Strategy](/storage-and-data/settings-and-data/).
