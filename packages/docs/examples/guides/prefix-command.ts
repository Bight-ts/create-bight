import { createPrefixCommandsPlugin, definePrefixCommand } from "@bight-ts/plugin-prefix-commands";

const pingPrefixCommand = definePrefixCommand({
  data: {
    name: "ping",
    description: "Reply with pong.",
  },
  async execute({ message }) {
    await message.reply("Pong.");
  },
});

export const prefixCommandsPlugin = createPrefixCommandsPlugin({
  commands: [pingPrefixCommand],
  getPrefixes: async ({ context, message }) => {
    const settings = await context.services.guildSettings.get(message.guildId ?? "dm");
    return [settings.prefix];
  },
});
