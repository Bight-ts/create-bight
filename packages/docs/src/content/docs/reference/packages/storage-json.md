---
title: "@bight-ts/storage-json"
description: API reference for the JSON file storage adapter.
---

```ts
import { JsonStorageAdapter } from "@bight-ts/storage-json";
```

## `JsonStorageAdapter`

Implements `StorageAdapter` using a JSON file on disk.

### Constructor

```ts
new JsonStorageAdapter({ filePath: "./data/db.json" });
```

| Option     | Type     | Required | Description                                                           |
| ---------- | -------- | -------- | --------------------------------------------------------------------- |
| `filePath` | `string` | Yes      | Path to the JSON file. Created automatically with parent directories. |

### Behavior

- Reads and writes the entire file on every operation (no partial updates).
- Data structure: `{ global: Record<string, StorageValue>, guilds: Record<string, Record<string, StorageValue>> }`
- Suitable for local development and small bots. Not recommended for production.

## Related

- [JSON Storage](/storage-and-data/json/)
- [Choosing a Storage Backend](/storage-and-data/choosing-a-backend/)
