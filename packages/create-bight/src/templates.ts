import type {
  CommandMode,
  ExtraName,
  StorageKind,
  TemplateName,
} from "./types.js";

export interface ScaffoldTemplate {
  value: TemplateName;
  label: string;
  hint: string;
  description: string;
  defaults: {
    storage: StorageKind;
    commandMode: CommandMode;
    cooldowns: boolean;
    extras: ExtraName[];
  };
}

export const scaffoldTemplates: ScaffoldTemplate[] = [
  {
    value: "starter",
    label: "Starter",
    hint: "Balanced default for most bots.",
    description:
      "JSON state, guild-first command deploys, cooldowns, validation helpers, and Discord formatter examples.",
    defaults: {
      storage: "json",
      commandMode: "guild",
      cooldowns: true,
      extras: ["validation", "formatters"],
    },
  },
  {
    value: "minimal",
    label: "Minimal",
    hint: "Smallest official starting point.",
    description:
      "JSON state, guild-first deploys, cooldowns, and no extra batteries scaffolded up front.",
    defaults: {
      storage: "json",
      commandMode: "guild",
      cooldowns: true,
      extras: [],
    },
  },
  {
    value: "hybrid",
    label: "Hybrid community bot",
    hint: "Slash-first plus text command surfaces.",
    description:
      "JSON state, guild-first deploys, settings, devtools, message commands, prefix commands, validation helpers, and formatter examples.",
    defaults: {
      storage: "json",
      commandMode: "guild",
      cooldowns: true,
      extras: [
        "validation",
        "formatters",
        "devtools",
        "settings",
        "message-commands",
        "prefix-commands",
      ],
    },
  },
  {
    value: "ops-ready",
    label: "Ops-ready",
    hint: "Good fit for hosted bots with more guardrails.",
    description:
      "JSON state, guild-first deploys, devtools, settings, startup checks, validation helpers, and formatter examples.",
    defaults: {
      storage: "json",
      commandMode: "guild",
      cooldowns: true,
      extras: [
        "validation",
        "formatters",
        "devtools",
        "settings",
        "startup-checks",
      ],
    },
  },
];

export function getScaffoldTemplate(
  templateName: TemplateName | undefined,
): ScaffoldTemplate {
  return (
    scaffoldTemplates.find((template) => template.value === templateName)
    ?? scaffoldTemplates[0]
  );
}
