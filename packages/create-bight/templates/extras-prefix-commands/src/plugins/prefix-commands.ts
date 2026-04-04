import { createPrefixCommandsPlugin } from "@bight-ts/plugin-prefix-commands";
import { prefixCommands } from "~/prefix-commands/index.js";
import type { AppServices } from "~/services/index.js";

export default createPrefixCommandsPlugin<AppServices>({
  commands: prefixCommands,
  // Replace this with storage-backed prefixes when your app needs per-guild config.
  getPrefixes: () => ["!"],
});
