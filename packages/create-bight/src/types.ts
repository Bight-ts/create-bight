export type StorageKind = "json" | "keyv" | "drizzle" | "prisma" | "mongoose";
export type SqlProvider = "sqlite" | "postgres" | "mysql";
export type KeyvStore = "sqlite" | "postgres" | "mysql" | "redis";
export type CommandMode = "global" | "guild";
export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";
export type TemplateName = "starter" | "minimal" | "hybrid" | "ops-ready";
export type ExtraName =
  | "validation"
  | "scheduler"
  | "formatters"
  | "time"
  | "cache"
  | "devtools"
  | "i18n"
  | "settings"
  | "message-commands"
  | "prefix-commands"
  | "startup-checks"
  | "dev-commands";

export interface CliOptions {
  dir: string;
  name: string;
  packageName: string;
  botName: string;
  template: TemplateName;
  storage: StorageKind;
  sqlProvider?: SqlProvider;
  keyvStore?: KeyvStore;
  commandMode: CommandMode;
  cooldowns: boolean;
  extras: ExtraName[];
  packageManager: PackageManager;
  install: boolean;
  git: boolean;
  yes: boolean;
}
