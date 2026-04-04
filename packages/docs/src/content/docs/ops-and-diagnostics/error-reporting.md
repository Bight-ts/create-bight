---
title: Error Reporting
description: Forward runtime errors to external monitoring tools.
---

Bight's [diagnostics hub](/ops-and-diagnostics/diagnostics/) catches errors from commands, interactions, and scheduled tasks. The `@bight-ts/plugin-ops` error reporter subscribes to these events and forwards them to your monitoring tool (Sentry, Datadog, a Discord webhook, etc).

## Setup

Expose your error reporter as a [service](/architecture/services/), then configure the plugin:

```ts title="src/plugins/error-reporting.ts"
import { createErrorReporterPlugin } from "@bight-ts/plugin-ops";

export const errorReporterPlugin = createErrorReporterPlugin({
  getReporter: (context) => context.services.sentryReporter,

  includeCommandErrors: true,
  includeInteractionErrors: true,
  includeTaskFailures: true,
});
```

Add to `src/plugins/index.ts`.

## Behavior

Errors recorded by this plugin do not crash the Node.js process, the diagnostics hub handles them gracefully.

The reporter receives structured event data (command name, user ID, guild ID, error message) so your monitoring tool can filter and alert effectively.
