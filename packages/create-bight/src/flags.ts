import type { CliOptions, ExtraName, KeyvStore, SqlProvider, StorageKind } from "./types.js";

export function parseFlags(argv: string[]): Partial<CliOptions> {
  const output: Partial<CliOptions> = {};

  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      continue;
    }

    const [rawKey, rawValue] = splitFlag(arg);
    const value = rawValue ?? "true";

    switch (rawKey) {
      case "dir":
        output.dir = value;
        break;
      case "name":
        output.name = value;
        break;
      case "package-name":
        output.packageName = value;
        break;
      case "bot-name":
        output.botName = value;
        break;
      case "storage":
        output.storage = value as StorageKind;
        break;
      case "sql-provider":
        output.sqlProvider = value as SqlProvider;
        break;
      case "keyv-store":
        output.keyvStore = value as KeyvStore;
        break;
      case "command-mode":
        output.commandMode = value as CliOptions["commandMode"];
        break;
      case "cooldowns":
        output.cooldowns = parseBoolean(value);
        break;
      case "extras":
        output.extras = value
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean) as ExtraName[];
        break;
      case "install":
        output.install = parseBoolean(value);
        break;
      case "git":
        output.git = parseBoolean(value);
        break;
      case "yes":
        output.yes = true;
        break;
      default:
        break;
    }
  }

  return output;
}

function splitFlag(input: string): [string, string | undefined] {
  const normalized = input.slice(2);
  const [key, ...rest] = normalized.split("=");
  return [key, rest.length > 0 ? rest.join("=") : undefined];
}

function parseBoolean(input: string): boolean {
  return input !== "false";
}
