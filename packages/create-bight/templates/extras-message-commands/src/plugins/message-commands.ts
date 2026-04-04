import { createMessageCommandsPlugin } from "@bight-ts/plugin-message-commands";
import { messageCommands } from "~/message-commands/index.js";
import type { AppServices } from "~/services/index.js";

export default createMessageCommandsPlugin<AppServices>({
  commands: messageCommands,
});
