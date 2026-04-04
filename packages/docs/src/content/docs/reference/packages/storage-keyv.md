---
title: "@bight-ts/storage-keyv"
description: API reference for the Keyv storage adapter.
---

```ts
import {
  KeyvStorageAdapter,
  createKeyvStorageAdapter,
} from "@bight-ts/storage-keyv";
```

## `createKeyvStorageAdapter(options?)`

Factory function. Returns a `KeyvStorageAdapter` instance.

## `KeyvStorageAdapter`

Implements `StorageAdapter` using [Keyv](https://keyv.org) for key-value persistence.

### Constructor

```ts
new KeyvStorageAdapter({ url: "redis://localhost:6379", namespace: "bight" });
```

| Option      | Type                 | Required | Description                                            |
| ----------- | -------------------- | -------- | ------------------------------------------------------ |
| `keyv`      | `Keyv<StorageValue>` | No       | Provide your own Keyv instance                         |
| `url`       | `string`             | No       | Connection URL. Ignored when `keyv` is provided.       |
| `namespace` | `string`             | No       | Key prefix in the backing store. Defaults to `"bight"` |

### Supported URL schemes

| Scheme                      | Backend    | Requires         |
| --------------------------- | ---------- | ---------------- |
| `redis:`                    | Redis      | `@keyv/redis`    |
| `sqlite:`                   | SQLite     | `@keyv/sqlite`   |
| `postgres:` / `postgresql:` | PostgreSQL | `@keyv/postgres` |
| `mysql:`                    | MySQL      | `@keyv/mysql`    |

When no URL or `keyv` instance is provided, falls back to in-memory storage (data lost on restart).

### Behavior

- Guild values are stored as a single serialized object per guild, keyed by `{namespace}:guild:{guildId}:__object__`.
- Global values are stored individually, keyed by `{namespace}:global:{key}`.

## Related

- [Keyv Storage](/storage-and-data/keyv/)
- [Choosing a Storage Backend](/storage-and-data/choosing-a-backend/)
