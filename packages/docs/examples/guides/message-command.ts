import { createMessageCommandsPlugin, defineMessageCommand } from "@bight-ts/plugin-message-commands";

const helloMessageCommand = defineMessageCommand({
  data: {
    name: "hello-bight",
    description: "Reply when someone says hello bight.",
  },
  match: ({ message }) => message.content.toLowerCase() === "hello bight",
  async execute({ message }) {
    await message.reply("Hello from Bight.");
  },
});

export const messageCommandsPlugin = createMessageCommandsPlugin({
  commands: [helloMessageCommand],
});
