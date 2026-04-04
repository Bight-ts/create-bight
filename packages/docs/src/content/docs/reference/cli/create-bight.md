---
title: "create-bight"
description: CLI reference for scaffolding a new Bight app.
---

```bash
pnpm create bight
```

Scaffolds a new Bight project with opinionated defaults, directory structure, and optional extras.

## Options

| Flag             | Values                                          | Description                                |
| ---------------- | ----------------------------------------------- | ------------------------------------------ |
| `--storage`      | `json`, `keyv`, `drizzle`, `prisma`, `mongoose` | Storage adapter for Bight's internal state |
| `--command-mode` | `guild`, `global`                               | Default command deployment target          |
| `--extras`       | Comma-separated list                            | Optional packages to include (see below)   |
| `--sql-provider` | `sqlite`, `postgres`, `mysql`                   | SQL dialect when using `drizzle` storage   |

## Available extras

| Extra              | Package                             | Description                          |
| ------------------ | ----------------------------------- | ------------------------------------ |
| `scheduler`        | `@bight-ts/plugin-scheduler`        | Persistent recurring tasks           |
| `devtools`         | `@bight-ts/plugin-devtools`         | In-Discord diagnostics dashboard     |
| `i18n`             | `@bight-ts/i18n`                    | Localization service                 |
| `settings`         | `@bight-ts/settings`                | Typed guild settings with validation |
| `message-commands` | `@bight-ts/plugin-message-commands` | Free-form text triggers              |
| `prefix-commands`  | `@bight-ts/plugin-prefix-commands`  | Classic `!command` support           |
| `startup-checks`   | `@bight-ts/plugin-ops`              | Boot-time configuration validation   |

## Examples

```bash
# Interactive mode
pnpm create bight

# Non-interactive with flags
pnpm create bight --storage=prisma --sql-provider=sqlite --extras=settings,startup-checks
```

## What gets generated

- `src/bight.ts` — Framework entry with client options, intents, and discovery
- `src/services/index.ts` — Explicit service definitions
- `src/plugins/index.ts` — Plugin registration array
- `src/storage/adapter.ts` — Storage adapter configuration
- `src/commands/ping.ts` — Example slash command
- `.env.example` — Environment variable template
