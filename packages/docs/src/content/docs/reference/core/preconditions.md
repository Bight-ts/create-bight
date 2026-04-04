---
title: "@bight-ts/core — Preconditions"
description: API reference for precondition definitions, factory functions, and denied handling.
---

```ts
import {
  definePrecondition,
  createAdministratorPrecondition,
  createGuildOnlyPrecondition,
  createOwnerOnlyPrecondition,
  createUserPermissionsPrecondition,
  createDevelopmentOnlyPrecondition,
} from "@bight-ts/core";
```

## `definePrecondition(precondition)`

Defines a custom precondition.

### `BightPrecondition<TServices>`

| Property | Type                                                                  | Required | Description                                               |
| -------- | --------------------------------------------------------------------- | -------- | --------------------------------------------------------- |
| `name`   | `string`                                                              | Yes      | Unique name, referenced in command `preconditions` arrays |
| `check`  | `(input: BightPreconditionExecution) => BightPreconditionCheckResult` | Yes      | Evaluation function                                       |

### `BightPreconditionExecution<TServices>`

| Property      | Type                                     | Description                                                                                     |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `kind`        | `BightExecutionKind`                     | `"command"`, `"button"`, `"modal"`, `"select-menu"`, `"message-command"`, or `"prefix-command"` |
| `subject`     | `BightExecutionSubject`                  | The interaction or message that triggered this check                                            |
| `interaction` | `BightSupportedInteraction \| undefined` | Present for interaction-based triggers                                                          |
| `message`     | `Message \| undefined`                   | Present for message-based triggers                                                              |
| `context`     | `BightContext<TServices>`                | Your app context                                                                                |

### `BightPreconditionCheckResult`

Return one of:

- `true` or `void` — allow
- `false` — deny with default message
- `string` — deny with custom message
- `{ ok: boolean, message?: string }` — explicit result

## Factory functions

| Function                                     | Default name                  | Options                                                    |
| -------------------------------------------- | ----------------------------- | ---------------------------------------------------------- |
| `createAdministratorPrecondition(options?)`  | `"administrator-only"`        | `name?`, `message?`                                        |
| `createGuildOnlyPrecondition(options?)`      | `"guild-only"`                | `name?`, `message?`, `guildIds?: string[]`                 |
| `createOwnerOnlyPrecondition(options)`       | `"owner-only"`                | `ownerIds: string[]`, `name?`, `message?`                  |
| `createUserPermissionsPrecondition(options)` | `"required-user-permissions"` | `permissions: PermissionResolvable[]`, `name?`, `message?` |
| `createDevelopmentOnlyPrecondition(options)` | `"development-only"`          | `isDevelopment: boolean`, `name?`, `message?`              |

## Denied handling

### `BightDeniedExecution<TServices>`

Passed to `onDenied` handlers.

| Property   | Type                                  | Description                                    |
| ---------- | ------------------------------------- | ---------------------------------------------- |
| `kind`     | `BightExecutionKind`                  | What type of execution was denied              |
| `subject`  | `BightExecutionSubject`               | The triggering interaction or message          |
| `context`  | `BightContext<TServices>`             | Your app context                               |
| `reason`   | `BightDeniedReason`                   | Denial details (see below)                     |
| `handled`  | `boolean`                             | Whether a handler has already responded        |
| `reply`    | `(message?: string) => Promise<void>` | Send a denial response to the user             |
| `suppress` | `() => void`                          | Silently drop the denial with no user response |

### `BightDeniedReason`

| Property           | Type                                                                    | Description                                          |
| ------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| `code`             | `"development_only" \| "missing_precondition" \| "precondition_failed"` | Denial category                                      |
| `message`          | `string`                                                                | Human-readable denial message                        |
| `preconditionName` | `string \| undefined`                                                   | Name of the precondition that failed (if applicable) |

## Evaluation order

1. Global preconditions run first (registered via plugins).
2. Local preconditions run second (attached to individual commands/handlers).
3. If any precondition fails, execution halts and the `onDenied` handler (or default) runs.

## Related

- [Preconditions & Denials](/commands-and-interactions/preconditions-and-denied/)
- [Maintenance Mode](/ops-and-diagnostics/maintenance-mode/)
- [Runtime Flow](/core-concepts/runtime-flow/)
