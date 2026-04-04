import { defineMessageCommand } from "@bight-ts/plugin-message-commands";
import type { AppServices } from "~/services/index.js";

export default defineMessageCommand<AppServices>({
  data: {
    name: "hello-bight",
    description: "Reply when someone says hello bight.",
  },
  match: ({ message }) => message.content.trim().toLowerCase() === "hello bight",
  async execute({ message }) {
    await message.reply("Hello from Bight.");
  },
});
