---
title: Settings & Data Strategy
description: The three persistence layers in a Bight app and when to use each.
---

A Bight app has three distinct persistence layers. Using the right one for each type of data keeps your codebase clean and your queries fast.

![Storage layers diagram](../../../assets/storage-layers.svg)

## 1. Storage facade

**Access:** `storage.global` / `storage.guilds`
**Package:** `@bight-ts/core`

A simple key-value store for internal framework state: feature flags, plugin metadata (like scheduler timestamps), and small scalar values. Powered by [storage adapters](/storage-and-data/choosing-a-backend/).

Using storage facade directly for application domain data is not recommended. It's designed for framework-level config.

## 2. Settings service

**Access:** `context.services.guildSettings`
**Package:** `@bight-ts/settings`

Typed, validated guild-specific settings with defaults. Under the hood, it uses the storage facade for persistence, but adds Zod validation, default merging, and cache synchronization.

Use this for settings a guild admin would configure: custom prefix, log channel ID, language preference, feature toggles.

See [Guild Settings](/advanced-features/guild-settings/) for setup and usage.

## 3. Direct database

**Access:** `context.services.db` / `context.services.prisma`

Your application's actual database. User accounts, moderation logs, economy ledgers, game state, or anything with relational structure or high query volume goes directly through your ORM (Prisma, Drizzle, Mongoose).

Add the database client as a [service](/architecture/services/) and query it directly in commands. Don't route domain data through Bight's storage facade.

## Overall

| Layer            | Data type                      | Access path                         |
| ---------------- | ------------------------------ | ----------------------------------- |
| Storage facade   | Feature flags, plugin state    | `storage.global` / `storage.guilds` |
| Settings service | Guild config with validation   | `context.services.guildSettings`    |
| Direct database  | Domain data (users, logs, etc) | `context.services.db`               |
