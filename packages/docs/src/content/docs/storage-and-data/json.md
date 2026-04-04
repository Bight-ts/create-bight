---
title: JSON Storage
description: File-based storage adapter for local development.
---

`@bight-ts/storage-json` writes Bight's internal state to a JSON file on disk. Use it for local development and prototyping.

## Setup

```ts title="src/storage/adapter.ts"
import { JsonStorageAdapter } from "@bight-ts/storage-json";
import { createStorage } from "@bight-ts/core";

const adapter = new JsonStorageAdapter({
  filePath: "./data/db.json",
});

export const storage = createStorage(adapter);
```

The adapter creates the file and parent directories automatically on first write.

## Limitations

JSON storage reads and writes the entire file on every operation. It works for small bots with low concurrency but will bottleneck under high traffic. **Do not use in production**.

Switch to [Keyv](/storage-and-data/keyv/) or an [ORM-backed adapter](/storage-and-data/choosing-a-backend/) instead.
