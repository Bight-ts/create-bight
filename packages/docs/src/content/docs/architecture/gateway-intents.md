---
title: Gateway Intents
description: Configure which Discord events your bot receives.
---

Discord only sends events your bot explicitly requests through [Gateway Intents](https://discord.com/developers/docs/events/gateway#gateway-intents). Missing an intent means missing the corresponding events. This is one of the most common sources of bot bugs.

## Default intents

The generated scaffold starts with the minimum intent for slash command bots:

```ts title="src/bight.ts"
import { GatewayIntentBits } from "discord.js";

// Inside client options
intents: [GatewayIntentBits.Guilds]
```

`Guilds` covers guild join/leave events and the baseline data needed for slash commands.

## Expanding intents

Add intents in `src/bight.ts` when you need access to additional event types:

| Feature | Required intents | Privileged? |
|---------|-----------------|-------------|
| [Prefix commands](/commands-and-interactions/prefix-commands/) | `GuildMessages`, `MessageContent` | `MessageContent` is privileged |
| [Message commands](/commands-and-interactions/message-commands/) | `GuildMessages`, `MessageContent` | `MessageContent` is privileged |
| Voice state tracking | `GuildVoiceStates` | No |
| Member join/leave events | `GuildMembers` | Yes |
| Presence updates | `GuildPresences` | Yes |

**Privileged intents** must also be enabled in the [Discord Developer Portal](https://discord.com/developers/applications) under your bot's settings. Enabling them in code alone is not enough.

## Keeping intents centralized

All intent configuration lives in `src/bight.ts`. This makes the bot's event surface visible from one file, so there's no need to search the codebase to understand what data the bot receives from Discord.
