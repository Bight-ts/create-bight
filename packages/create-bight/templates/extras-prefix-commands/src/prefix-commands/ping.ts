import { definePrefixCommand } from "@bight-ts/plugin-prefix-commands";
import type { AppServices } from "~/services/index.js";

export default definePrefixCommand<AppServices>({
  data: {
    name: "ping",
    aliases: ["p"],
    description: "Reply to a classic prefix ping command.",
  },
  async execute({ message, prefix, args }) {
    await message.reply(
      [
        `prefix: ${prefix}`,
        `args: ${args.length > 0 ? args.join(", ") : "none"}`,
        "pong",
      ].join("\n"),
    );
  },
});
