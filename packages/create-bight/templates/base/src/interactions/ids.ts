import { defineCustomId } from "@bight-ts/core";

export const feedbackOpenId = defineCustomId({
  prefix: "feedback:open",
});

export const feedbackModalId = defineCustomId({
  prefix: "feedback:submit",
  fields: ["source"] as const,
});

export const settingsThemeId = defineCustomId({
  prefix: "settings:theme",
});
