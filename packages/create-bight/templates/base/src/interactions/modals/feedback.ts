import { MessageFlags } from "discord.js";
import { defineAppModalHandler } from "~/bight.js";
import { feedbackModalId } from "~/interactions/ids.js";

export default defineAppModalHandler({
  customIdPrefix: feedbackModalId.customIdPrefix,
  async execute({ interaction }) {
    const customId = feedbackModalId.parse(interaction.customId);
    if (!customId) {
      await interaction.reply({
        content: "This feedback form is no longer active.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const details = interaction.fields.getTextInputValue("details");
    await interaction.reply({
      content: `Received ${customId.source} feedback: ${details}`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
