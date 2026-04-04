---
title: "@bight-ts/core — Plugins"
description: API reference for plugin definitions, lifecycle hooks, and the setup interface.
---

```ts
import {
  definePlugin,
  definePlugins,
  type BightPlugin,
  type BightPluginSetup,
} from "@bight-ts/core";
```

## `definePlugin(plugin)`

Defines a plugin with lifecycle hooks.

### `BightPlugin<TServices>`

| Property      | Type                                    | Required | Description                                                                             |
| ------------- | --------------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `name`        | `string`                                | Yes      | Plugin identifier (visible in diagnostics)                                              |
| `setup`       | `(input: BightPluginSetup) => void`     | No       | Runs during initialization. Can register commands, handlers, preconditions, and events. |
| `beforeLogin` | `(input: BightPluginLifecycle) => void` | No       | Runs after all plugins are set up, before connecting to Discord                         |
| `afterLogin`  | `(input: BightPluginLifecycle) => void` | No       | Runs after the bot is online                                                            |

### `BightPluginSetup<TServices>`

Available inside the `setup` hook.

| Property                | Type                                              | Description                        |
| ----------------------- | ------------------------------------------------- | ---------------------------------- |
| `client`                | `Client`                                          | The Discord.js client              |
| `context`               | `BightContext<TServices>`                         | The app context                    |
| `registry`              | `BightRegistry`                                   | The command/handler registry       |
| `pluginNames`           | `string[]`                                        | Names of all registered plugins    |
| `getEventCount`         | `() => number`                                    | Current total event listener count |
| `diagnostics`           | `BightDiagnosticsHub`                             | The diagnostics hub                |
| `addCommand`            | `(command: BotCommand) => void`                   | Register a command                 |
| `addPrecondition`       | `(precondition: BightPrecondition) => void`       | Register a precondition            |
| `addGlobalPrecondition` | `(precondition: BightGlobalPrecondition) => void` | Register a global precondition     |
| `addButtonHandler`      | `(handler: ButtonHandler) => void`                | Register a button handler          |
| `addModalHandler`       | `(handler: ModalHandler) => void`                 | Register a modal handler           |
| `addSelectMenuHandler`  | `(handler: SelectMenuHandler) => void`            | Register a select menu handler     |
| `addEvent`              | `(event: BotEvent) => void`                       | Register an event listener         |

### `BightPluginLifecycle<TServices>`

Available inside `beforeLogin` and `afterLogin` hooks. Same as `BightPluginSetup` but without the `add*` methods — registration is only allowed during `setup`.

## `definePlugins(plugins)`

Filters out falsey values from a plugin array, enabling conditional inclusion:

```ts
const plugins = definePlugins([
  devtoolsPlugin,
  process.env.ENABLE_SCHEDULER === "true" && schedulerPlugin,
]);
// falsey entries are removed
```

## `BightOfficialPluginOptions`

Base options type for official Bight plugins.

| Property      | Type      | Description                                   |
| ------------- | --------- | --------------------------------------------- |
| `enabled`     | `boolean` | Toggle the plugin on or off (default: `true`) |
| `name`        | `string`  | Override the plugin name                      |
| `loggerScope` | `string`  | Logger scope for this plugin                  |

## Related

- [Plugins](/architecture/plugins/)
- [Diagnostics & Devtools](/ops-and-diagnostics/diagnostics/)
- [@bight-ts/plugin-ops](/reference/packages/plugin-ops/)
