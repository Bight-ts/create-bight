import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { defineCommand } from "@bight-ts/core";

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Reply with pong."),
  async execute({ interaction }) {
    await interaction.reply({
      content: "Pong.",
      flags: MessageFlags.Ephemeral,
    });
  },
});
