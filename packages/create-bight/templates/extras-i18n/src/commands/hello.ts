import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { defineAppCommand } from "~/bight.js";

export default defineAppCommand({
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Reply with a localized Bight greeting."),
  async execute({ interaction, context }) {
    const i18n = context.services.i18n.forInteraction(interaction);

    await interaction.reply({
      content: [
        `locale: ${i18n.locale}`,
        i18n.t("commands.hello.reply"),
      ].join("\n"),
      flags: MessageFlags.Ephemeral,
    });
  },
});
