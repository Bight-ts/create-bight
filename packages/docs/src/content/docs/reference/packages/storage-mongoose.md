---
title: "@bight-ts/storage-mongoose"
description: API reference for the Mongoose storage adapter and schema helpers.
---

```ts
import {
  createMongooseStorageAdapter,
  createMongooseStorageSchemas,
} from "@bight-ts/storage-mongoose";
```

## `createMongooseStorageAdapter(options)`

Creates a `StorageAdapter` that persists Bight state using Mongoose models.

### `MongooseStorageAdapterOptions`

| Property        | Type                     | Required | Description                                                                       |
| --------------- | ------------------------ | -------- | --------------------------------------------------------------------------------- |
| `connect`       | `() => Promise<unknown>` | Yes      | Lazy connection function. Called before each operation. Mongoose handles pooling. |
| `globalConfigs` | Mongoose model           | Yes      | Model with `{ key: String (unique), value: Mixed }`                               |
| `guildConfigs`  | Mongoose model           | Yes      | Model with `{ guildId: String (unique), value: Mixed }`                           |

## `createMongooseStorageSchemas()`

Returns pre-built Mongoose schemas for the required models:

```ts
const { globalConfigSchema, guildConfigSchema } =
  createMongooseStorageSchemas();

const GlobalConfig = model("GlobalConfig", globalConfigSchema);
const GuildConfig = model("GuildConfig", guildConfigSchema);
```

Both schemas include `timestamps: true` for `createdAt` / `updatedAt`.

### Behavior

- Uses `findOne` + `findOneAndUpdate` with `upsert: true`.
- Guild values are stored as a single document per guild with a Mixed `value` field.
- The `connect` function is called lazily before each operation — Mongoose handles connection reuse.

## Related

- [Mongoose Storage](/storage-and-data/mongoose/)
- [Choosing a Storage Backend](/storage-and-data/choosing-a-backend/)
