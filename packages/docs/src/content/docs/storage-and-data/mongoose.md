---
title: Mongoose Storage
description: Store Bight's internal state in MongoDB via Mongoose.
---

`@bight-ts/storage-mongoose` lets Bight persist its framework state using Mongoose models, keeping everything in the same MongoDB database your app already uses.

## Schema setup

The package provides pre-built schemas:

```ts title="src/db/bight-models.ts"
import { model } from "mongoose";
import { createMongooseStorageSchemas } from "@bight-ts/storage-mongoose";

const { globalConfigSchema, guildConfigSchema } =
  createMongooseStorageSchemas();

export const GlobalConfig = model("GlobalConfig", globalConfigSchema);
export const GuildConfig = model("GuildConfig", guildConfigSchema);
```

Each schema defines a single document with a unique key/guildId and a Mixed `value` field.

## Adapter setup

```ts title="src/storage/adapter.ts"
import { createMongooseStorageAdapter } from "@bight-ts/storage-mongoose";
import { createStorage } from "@bight-ts/core";
import { connect } from "mongoose";
import { GlobalConfig, GuildConfig } from "../db/bight-models";

const adapter = createMongooseStorageAdapter({
  connect: () => connect(process.env.MONGODB_URI!), // Ideally mapped through the env.ts
  globalConfigs: GlobalConfig,
  guildConfigs: GuildConfig,
});

export const storage = createStorage(adapter);
```

The `connect` function is called lazily before each database operation. Mongoose handles connection pooling, so this is safe to call repeatedly.

## Domain data

This adapter handles Bight's framework state only. For your app's domain models (user profiles, logs, etc), import your Mongoose models directly or wrap them in a [service](/architecture/services/). See [Settings & Data Strategy](/storage-and-data/settings-and-data/).
