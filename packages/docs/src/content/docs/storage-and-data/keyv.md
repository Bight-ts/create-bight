---
title: Keyv Storage
description: Key-value storage adapter backed by Redis, SQLite, Postgres, or MongoDB.
---

`@bight-ts/storage-keyv` uses [Keyv](https://keyv.org) to store Bight's internal state in any Keyv-supported backend. It's the recommended adapter for production deployments that don't need an ORM.

## Setup

### With a connection URL

```ts title="src/storage/adapter.ts"
import { createKeyvStorageAdapter } from "@bight-ts/storage-keyv";
import { createStorage } from "@bight-ts/core";

const adapter = createKeyvStorageAdapter({
  url: "redis://localhost:6379",
  namespace: "bight", // optional, defaults to "bight"
});

export const storage = createStorage(adapter);
```

Supported URL schemes: `redis:`, `sqlite:`, `postgres:`/`postgresql:`, `mysql:`.

### With an existing Keyv instance

```ts title="src/storage/adapter.ts"
import Keyv from "keyv";
import { KeyvStorageAdapter } from "@bight-ts/storage-keyv";
import { createStorage } from "@bight-ts/core";

const keyv = new Keyv("sqlite://./data/bight.sqlite");
const adapter = new KeyvStorageAdapter({ keyv });

export const storage = createStorage(adapter);
```

When no URL or Keyv instance is provided, the adapter falls back to in-memory storage (useful for tests, but state is lost on restart).
