---
title: Plugins
description: Hook into the app lifecycle to add startup logic, global preconditions, and runtime behaviors.
---

Plugins run code **around** your application. At boot, on login, or in response to runtime events. They are not called directly from your commands.

## Services vs plugins

Use a **service** when your code needs to call something: `context.services.db.query(...)`.

Use a **plugin** when something needs to happen on its own: "run a health check on startup", "reject all commands during maintenance", "start a recurring task".

## What plugins can do

Plugins have access to the full lifecycle:

| Hook            | When it runs                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `setup()`       | During initialization, before login. Can register commands, preconditions, handlers, and events. |
| `beforeLogin()` | After setup, immediately before establishing the Discord WebSocket connection.                   |
| `afterLogin()`  | After the bot is online and the `ready` event has the potential to fire.                         |

Plugins also receive the [diagnostics hub](/ops-and-diagnostics/diagnostics/), enabling them to subscribe to runtime events or register custom diagnostic sources.

## Registering plugins

Plugins are explicitly wired in `src/plugins/index.ts`:

```ts title="src/plugins/index.ts"
import { createDevtoolsPlugin } from "@bight-ts/plugin-devtools";

export const plugins = [
  createDevtoolsPlugin({
    ownerIds: ["123456789"],
  }),
];
```

There is no auto-injection. Every active plugin is visible in this array.

## Writing a custom plugin

```ts title="src/plugins/welcome-log.ts"
import { definePlugin } from "@bight-ts/core";

export const welcomeLogPlugin = definePlugin({
  name: "welcome-log",

  afterLogin({ context }) {
    context.logger.info("Bot is online and ready.");
  },
});
```

Plugins can register commands, handlers, and preconditions through the `setup` hook's helper methods (`addCommand`, `addPrecondition`, `addGlobalPrecondition`, etc). See the [plugin reference](/reference/core/plugins/) for the full `BightPluginSetup` interface.

## Conditional plugins

`definePlugins()` filters out falsey values, making conditional inclusion clean:

```ts title="src/plugins/index.ts"
import { definePlugins } from "@bight-ts/core";

export const plugins = definePlugins([
  createDevtoolsPlugin({ ownerIds: ["123456789"] }),
  process.env.ENABLE_SCHEDULER === "true" && schedulerPlugin,
  process.env.NODE_ENV === "production" && errorReporterPlugin,
]);
```
