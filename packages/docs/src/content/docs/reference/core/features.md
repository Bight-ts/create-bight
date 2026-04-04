---
title: "@bight-ts/core — Features"
description: API reference for feature module definitions.
---

```ts
import {
  defineFeature,
  defineFeatures,
  type BightFeature,
} from "@bight-ts/core";
```

## `defineFeature(feature)`

Defines a feature module that bundles related commands, handlers, and plugins.

### `BightFeature<TServices>`

| Property             | Type                  | Required | Description                                                         |
| -------------------- | --------------------- | -------- | ------------------------------------------------------------------- |
| `name`               | `string`              | Yes      | Feature identifier (used in error messages for duplicate detection) |
| `commands`           | `BotCommand[]`        | No       | Slash commands belonging to this feature                            |
| `preconditions`      | `BightPrecondition[]` | No       | Preconditions scoped to this feature                                |
| `buttonHandlers`     | `ButtonHandler[]`     | No       | Button interaction handlers                                         |
| `modalHandlers`      | `ModalHandler[]`      | No       | Modal submission handlers                                           |
| `selectMenuHandlers` | `SelectMenuHandler[]` | No       | Select menu handlers                                                |
| `events`             | `BotEvent[]`          | No       | Discord client event listeners                                      |
| `plugins`            | `MaybeBightPlugin[]`  | No       | Plugins scoped to this feature                                      |

## `defineFeatures(features)`

Identity function for typing an array of features:

```ts
const features = defineFeatures([musicModule, moderationModule]);
```

## Behavior

- Features are explicitly registered via `loadFeatures` in `createBightApp()` — they are not auto-discovered.
- Commands and handlers from features merge into the app's main registry during startup.
- Duplicate command names across features are detected and reported with the feature's `name` for context.

## Related

- [Feature Modules](/architecture/feature-modules/)
- [Project Structure](/getting-started/project-structure/)
- [@bight-ts/core App Runtime](/reference/core/app-runtime/)
