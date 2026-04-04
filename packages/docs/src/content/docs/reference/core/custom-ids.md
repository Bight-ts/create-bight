---
title: "@bight-ts/core — Custom IDs"
description: API reference for typed custom ID builders and parsing.
---

```ts
import {
  defineCustomId,
  type BightCustomId,
  type BightCustomIdValues,
} from "@bight-ts/core";
```

## `defineCustomId(options)`

Creates a typed custom ID helper for encoding and decoding structured data in Discord component custom IDs.

### Options

| Property    | Type                | Required | Description                                            |
| ----------- | ------------------- | -------- | ------------------------------------------------------ |
| `prefix`    | `string`            | Yes      | The stable prefix for this custom ID family            |
| `fields`    | `readonly string[]` | No       | Named fields to encode after the prefix                |
| `separator` | `string`            | No       | Delimiter between prefix and fields. Defaults to `":"` |

### Returns `BightCustomId<TFields>`

| Property / Method   | Type                                                  | Description                                                                                                  |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `prefix`            | `string`                                              | The raw prefix string                                                                                        |
| `customIdPrefix`    | `string`                                              | The prefix with trailing separator (for use in handler routing). Equals `prefix` when no fields are defined. |
| `fields`            | `readonly string[]`                                   | The field names                                                                                              |
| `build(values)`     | `(values: Record<field, string>) => string`           | Encodes values into a custom ID string                                                                       |
| `parse(customId)`   | `(customId: string) => Record<field, string> \| null` | Decodes a custom ID string. Returns `null` on mismatch.                                                      |
| `matches(customId)` | `(customId: string) => boolean`                       | Returns `true` if the custom ID matches this definition                                                      |

### Example

```ts
const ticketId = defineCustomId({
  prefix: "ticket",
  fields: ["action", "id"] as const,
});

ticketId.build({ action: "close", id: "42" }); // "ticket:close:42"
ticketId.parse("ticket:close:42"); // { action: "close", id: "42" }
ticketId.parse("other:data"); // null
ticketId.customIdPrefix; // "ticket:"

// Without fields
const simpleId = defineCustomId({ prefix: "confirm" });
simpleId.build({}); // "confirm"
simpleId.parse("confirm"); // {}
```

Values are URI-encoded during `build()` and decoded during `parse()`, so fields can contain special characters.

## Related

- [Buttons, Modals & Selects](/commands-and-interactions/buttons-modals-selects/)
- [@bight-ts/core Interactions](/reference/core/interactions/)
