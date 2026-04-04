import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { defineCommand } from "@bight-ts/core";

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Reply using the interaction locale."),
  async execute({ interaction, context }) {
    const t = context.services.i18n.forInteraction(interaction);

    await interaction.reply({
      content: t.t("commands.hello.reply"),
      flags: MessageFlags.Ephemeral,
    });
  },
});
