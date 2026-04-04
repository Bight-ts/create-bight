import { MessageFlags } from "discord.js";
import { defineAppSelectMenuHandler } from "~/bight.js";
import { settingsThemeId } from "~/interactions/ids.js";

export default defineAppSelectMenuHandler({
  customId: settingsThemeId.build({}),
  async execute({ interaction }) {
    await interaction.reply({
      content: `Theme updated to ${interaction.values.join(", ")}.`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
