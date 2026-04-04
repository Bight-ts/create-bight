import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { defineAppButtonHandler } from "~/bight.js";
import { feedbackModalId, feedbackOpenId } from "~/interactions/ids.js";

export default defineAppButtonHandler({
  customId: feedbackOpenId.build({}),
  async execute({ interaction }) {
    const modal = new ModalBuilder()
      .setCustomId(
        feedbackModalId.build({
          source: "button",
        }),
      )
      .setTitle("Feedback")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("details")
            .setLabel("Feedback")
            .setStyle(TextInputStyle.Paragraph),
        ),
      );

    await interaction.showModal(modal);
  },
});
