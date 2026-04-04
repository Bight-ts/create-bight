---
title: "@bight-ts/toolkit"
description: API reference for Bight's utility library — caching, locks, pagination, text, time, and validation helpers.
---

```ts
import { ... } from "@bight-ts/toolkit";
```

## Caching

| Export                        | Description                          |
| ----------------------------- | ------------------------------------ |
| `createMemoryCache(options?)` | Creates a TTL-based in-memory cache  |
| `MemoryCache`                 | Class constructor for the same       |
| `MemoryCacheOptions`          | `{ ttl?: number, maxSize?: number }` |

## Interactions

| Export                                 | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| `createConfirmationRow()`              | Builds a Discord ActionRow with Confirm/Cancel buttons |
| `createPagerRow()`                     | Builds previous/next pagination buttons                |
| `paginateItems(items, page, pageSize)` | Returns a page slice from an array                     |
| `clampPageIndex(page, totalPages)`     | Clamps a page index within valid range                 |

## Locks

| Export              | Description                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `createKeyedLock()` | Creates a per-key async mutex (prevents concurrent operations on the same ID) |
| `KeyedLock`         | The lock interface: `acquire(key) => Promise<() => void>`                     |

## Text

| Export                                 | Description                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `DISCORD_LIMITS`                       | Object with Discord character limits (`embed`, `message`, `fieldValue`, etc) |
| `formatJsonCodeBlock(value, options?)` | Formats a value as a JSON code block, auto-truncated                         |
| `splitText(text, options)`             | Splits long text at safe boundaries (newlines, spaces)                       |
| `truncateText(text, options)`          | Truncates with an optional suffix                                            |
| `truncateCodeBlock(text, options)`     | Truncates while preserving code block formatting                             |

## Time

| Export                           | Description                                               |
| -------------------------------- | --------------------------------------------------------- |
| `discordTimestamp(input, style)` | Formats a date as a Discord timestamp string (`<t:...>`)  |
| `longDateTime(input)`            | `discordTimestamp(input, "F")` — full date + time         |
| `relativeTime(input)`            | `discordTimestamp(input, "R")` — relative ("2 hours ago") |
| `shortTime(input)`               | `discordTimestamp(input, "t")` — short time               |

`DiscordTimestampInput` accepts `Date`, `number` (ms), or `string` (ISO).

## Validation

| Export                                       | Description                                                       |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `parseOption(interaction, name, schema)`     | Parses a command option through a Zod schema, throwing on failure |
| `safeParseOption(interaction, name, schema)` | Same, but returns `SafeParseResult`                               |
| `parseWithSchema(value, schema)`             | Parse any value through a Zod schema                              |
| `safeParseWithSchema(value, schema)`         | Same, safe variant                                                |
| `formatZodIssues(issues, options?)`          | Formats Zod validation errors into readable strings               |
| `formatSafeParseIssues(result)`              | Extracts and formats issues from a `SafeParseResult`              |

## Related

- [Slash Commands](/commands-and-interactions/slash-commands/)
- [Buttons, Modals & Selects](/commands-and-interactions/buttons-modals-selects/)
