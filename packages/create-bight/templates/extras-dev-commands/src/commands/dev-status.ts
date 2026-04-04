import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { defineAppCommand } from "~/bight.js";

export default defineAppCommand({
  data: new SlashCommandBuilder()
    .setName("dev-status")
    .setDescription("Show template runtime details."),
  devOnly: true,
  async execute({ interaction }) {
    await interaction.reply({
      content: `Bot: ${interaction.client.user?.tag ?? "not ready"}`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
