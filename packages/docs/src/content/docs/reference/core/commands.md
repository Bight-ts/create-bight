---
title: "@bight-ts/core — Commands"
description: API reference for command definitions, subcommands, and deployment metadata.
---

```ts
import {
  defineCommand,
  defineSubcommand,
  type BotCommand,
  type BightSubcommand,
} from "@bight-ts/core";
```

## `defineCommand(command)`

Defines a slash command. Accepts a `StandardBotCommand` (with `execute`) or a `GroupBotCommand` (with `subcommands`).

### `StandardBotCommand<TServices>`

| Property        | Type                                                    | Required | Description                                                    |
| --------------- | ------------------------------------------------------- | -------- | -------------------------------------------------------------- |
| `data`          | `SlashCommandBuilder \| SlashCommandOptionsOnlyBuilder` | Yes      | Discord.js command builder with name, description, and options |
| `execute`       | `(input: CommandExecution) => void`                     | Yes      | The command handler                                            |
| `autocomplete`  | `(input: AutocompleteExecution) => void`                | No       | Handler for autocomplete interactions                          |
| `preconditions` | `string[]`                                              | No       | Named preconditions to evaluate before execution               |
| `cooldown`      | `number`                                                | No       | Cooldown in milliseconds per user                              |
| `devOnly`       | `boolean`                                               | No       | Block execution in production environments                     |
| `deployment`    | `CommandDeployment`                                     | No       | Deployment targeting                                           |
| `onDenied`      | `BightDeniedHandler`                                    | No       | Custom denial handler                                          |

### `GroupBotCommand<TServices>`

| Property        | Type                                                        | Required | Description                                                                                |
| --------------- | ----------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `data`          | `SlashCommandBuilder \| SlashCommandSubcommandsOnlyBuilder` | Yes      | Discord.js command builder (name and description only — subcommands add their own options) |
| `subcommands`   | `BightSubcommand[]`                                         | Yes      | Array of subcommand definitions                                                            |
| `preconditions` | `string[]`                                                  | No       | Applied to all subcommands in this group                                                   |
| `cooldown`      | `number`                                                    | No       | Applied to all subcommands                                                                 |
| `devOnly`       | `boolean`                                                   | No       | Applied to all subcommands                                                                 |
| `deployment`    | `CommandDeployment`                                         | No       | Deployment targeting                                                                       |
| `onDenied`      | `BightDeniedHandler`                                        | No       | Custom denial handler                                                                      |

## `defineSubcommand(subcommand)`

Defines a subcommand within a grouped command.

### `BightSubcommand<TServices>`

| Property       | Type                                               | Required | Description                   |
| -------------- | -------------------------------------------------- | -------- | ----------------------------- |
| `name`         | `string`                                           | Yes      | Subcommand name               |
| `description`  | `string`                                           | Yes      | Subcommand description        |
| `build`        | `(builder: SlashCommandSubcommandBuilder) => void` | No       | Add options to the subcommand |
| `execute`      | `(input: CommandExecution) => void`                | Yes      | The subcommand handler        |
| `autocomplete` | `(input: AutocompleteExecution) => void`           | No       | Autocomplete handler          |

## `CommandExecution<TServices>`

Passed to `execute()` handlers.

| Property      | Type                          | Description                                        |
| ------------- | ----------------------------- | -------------------------------------------------- |
| `interaction` | `ChatInputCommandInteraction` | The Discord interaction                            |
| `context`     | `BightContext<TServices>`     | Your app context with services, client, and logger |

## `CommandDeployment`

| Property    | Type       | Description                       |
| ----------- | ---------- | --------------------------------- |
| `global`    | `boolean`  | Include in global deployments     |
| `guildOnly` | `string[]` | Deploy only to specific guild IDs |

## Related

- [Slash Commands](/commands-and-interactions/slash-commands/)
- [Preconditions & Denials](/commands-and-interactions/preconditions-and-denied/)
- [Command Deploy Modes](/commands-and-interactions/command-modes/)
