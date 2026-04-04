---
title: Bight vs Sapphire
description: An honest comparison of Bight and Sapphire across maturity, architecture, and design goals.
---

[Sapphire](https://www.sapphirejs.dev/) is the most established TypeScript Discord framework. Bight makes different tradeoffs. Let's see how they compare.

## At a glance

| | Sapphire | Bight |
|---|---------|-------|
| **Maturity** | Years of production use, large community | Newer, smaller community |
| **Architecture** | Store/piece model, class-first | Composition-first, explicit wiring |
| **Scope** | Broad. Covers most Discord bot patterns | Narrower. Optimized for modern interactions |
| **Plugin ecosystem** | Deep, community-driven | Smaller, official packages for now |
| **Command model** | Hybrid (prefix + slash) out of the box | Slash-first, prefix/message via opt-in plugins |
| **DI model** | Container-based | Explicit services through context |

## Where Sapphire is stronger

- **Ecosystem depth.** More official and community plugins covering a wider range of use cases.
- **Precondition maturity.** Richer composition patterns and denial handling surfaces.
- **Store architecture.** A more formal internal module system for large extension ecosystems.
- **Scheduled tasks.** More mature durable task execution and operational tooling.

## Where Bight is different

- **Readability.** A generated Bight app is designed to be understood by reading a few local files. The runtime flow is visible in `src/bight.ts`.
- **Explicit composition.** Dependencies live in `src/services/` and flow through `context`, not through a framework container.
- **Modern Discord-first.** The runtime prioritizes slash commands, typed custom IDs, and interaction routing as the primary path.
- **Cohesive batteries.** A smaller set of official packages designed to work together rather than a broad ecosystem.

## Who to choose

There is no right or wrong answer. It depends on your needs and preferences.

Choose Sapphire if you want the broadest ecosystem and the most battle-tested framework available today.

Choose Bight if you want a smaller mental model, explicit app composition, and a framework designed around modern Discord interactions.
