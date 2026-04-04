import {
  MessageFlags,
  SlashCommandBuilder,
  TimestampStyles,
  codeBlock,
  hyperlink,
  time,
} from "discord.js";
import { defineAppCommand } from "~/bight.js";

export default defineAppCommand({
  data: new SlashCommandBuilder()
    .setName("formatters")
    .setDescription("Show useful Discord formatter helpers."),
  async execute({ interaction }) {
    await interaction.reply({
      content: [
        `Docs: ${hyperlink("discord.js", "https://discord.js.org")}`,
        `Now: ${time(new Date(), TimestampStyles.RelativeTime)}`,
        codeBlock("ts", "const message = 'Formatter helpers are enabled.';"),
      ].join("\n"),
      flags: MessageFlags.Ephemeral,
    });
  },
});
