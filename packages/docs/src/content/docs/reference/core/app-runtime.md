---
title: "@bight-ts/core — App Runtime"
description: API reference for createBightApp, runtime options, and the app entry shape.
---

```ts
import {
  createBightApp,
  type CreateBightAppOptions,
  type BightAppRuntime,
} from "@bight-ts/core";
```

## `createBightApp(options)`

Creates a Bight application instance. Returns a `BightApp` with `start()` and `createRuntime()` methods.

### `CreateBightAppOptions<TServices>`

| Property         | Type                                          | Required | Description                                                                                                       |
| ---------------- | --------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `loadRegistry`   | `() => BightRegistry`                         | Yes      | Returns the command, handler, and precondition registry (typically via `createFilesystemDiscovery`)               |
| `createServices` | `(client: Client) => TServices`               | Yes\*    | Factory for your app services. Mutually exclusive with `createContext`.                                           |
| `createLogger`   | `(client: Client) => BightLogger`             | No       | Custom logger factory. Defaults to the built-in logger.                                                           |
| `createContext`  | `(client: Client) => BightContext<TServices>` | No       | Advanced escape hatch — builds the full context manually. Cannot be used with `createServices` or `createLogger`. |
| `clientOptions`  | `ClientOptions`                               | No       | Discord.js client options (intents, etc). Ignored if `createClient` is provided.                                  |
| `createClient`   | `() => Client`                                | No       | Custom client factory. Overrides `clientOptions`.                                                                 |
| `loadFeatures`   | `() => BightFeature[]`                        | No       | [Feature modules](/architecture/feature-modules/) to merge into the registry.                                     |
| `loadEvents`     | `() => BotEvent[]`                            | No       | Discord client event listeners.                                                                                   |
| `loadPlugins`    | `() => MaybeBightPlugin[]`                    | No       | [Plugins](/architecture/plugins/) to apply during initialization.                                                 |
| `runtime`        | Object                                        | No       | Runtime policies (see below).                                                                                     |
| `loginMessage`   | `string`                                      | No       | Custom log message on login. Defaults to `"Logging in to Discord."`                                               |

### `runtime` options

| Property              | Type                      | Description                                               |
| --------------------- | ------------------------- | --------------------------------------------------------- |
| `cooldowns`           | `CooldownOptions`         | Global cooldown configuration                             |
| `environment`         | `BightRuntimeEnvironment` | Runtime environment settings (e.g, `devOnly` enforcement) |
| `globalPreconditions` | `string[]`                | Names of preconditions to evaluate on every interaction   |
| `onDenied`            | `BightDeniedHandler`      | Global fallback handler for precondition denials          |

## `BightAppRuntime<TServices>`

Returned by `createRuntime()`. Contains all resolved runtime state.

| Property      | Type                               | Description                               |
| ------------- | ---------------------------------- | ----------------------------------------- |
| `client`      | `Client`                           | The Discord.js client instance            |
| `registry`    | `BightRegistry`                    | Resolved command and handler registry     |
| `context`     | `BightContext`                     | The context object passed to all handlers |
| `events`      | `BotEvent[]`                       | All registered event listeners            |
| `plugins`     | `AppliedPlugins`                   | Applied plugin state with lifecycle hooks |
| `diagnostics` | `BightDiagnosticsHub`              | The diagnostics hub                       |
| `start`       | `(token: string) => Promise<void>` | Connects to Discord                       |

## `BightContext<TServices>`

The context object passed into every command, interaction handler, and plugin hook.

| Property   | Type          | Description             |
| ---------- | ------------- | ----------------------- |
| `client`   | `Client`      | The Discord.js client   |
| `logger`   | `BightLogger` | The app logger          |
| `services` | `TServices`   | Your app-owned services |

## Related

- [Mental Model](/core-concepts/mental-model/)
- [Project Structure](/getting-started/project-structure/)
- [Gateway Intents](/architecture/gateway-intents/)
