---
title: Choosing a Storage Backend
description: Pick the right adapter for Bight's internal storage layer.
---

Bight's storage facade needs an adapter to persist framework state (settings, plugin metadata, feature flags). The adapter you choose powers `bight.storage`. It does **not** replace your application database.

The CLI asks which adapter to use during scaffolding. You can also change it later by swapping the adapter in `src/storage/adapter.ts`.

## Lightweight adapters

Best when you don't need a managed database for framework state.

| Adapter | Best for | Backend |
|---------|---------|---------|
| [JSON](/storage-and-data/json/) | Local development, tiny bots | File on disk |
| [Keyv](/storage-and-data/keyv/) | Lightweight production deployments | Redis, SQLite, Mongo, Postgres via Keyv |

## ORM-backed adapters

Best when your app already uses a database and you want Bight's state to live alongside your tables.

| Adapter | Best for | Backend |
|---------|---------|---------|
| [Prisma](/storage-and-data/prisma/) | Apps already using Prisma | Any Prisma-supported DB |
| [Drizzle](/storage-and-data/drizzle/) | Apps already using Drizzle | PostgreSQL, MySQL, SQLite |
| [Mongoose](/storage-and-data/mongoose/) | Apps already using MongoDB | MongoDB |

When using an ORM-backed adapter, keep the storage facade for framework state only. Use your ORM client directly (through [services](/architecture/services/)) for application domain queries. See [Settings & Data Strategy](/storage-and-data/settings-and-data/) for details.
