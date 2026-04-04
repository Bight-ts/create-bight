import { defineButtonHandler, defineCustomId, defineModalHandler } from "@bight-ts/core";
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

export const feedbackId = defineCustomId({
  prefix: "feedback",
  fields: ["ticketId"] as const,
});

export const openFeedbackModal = defineButtonHandler({
  customIdPrefix: feedbackId.customIdPrefix,
  async execute({ interaction }) {
    const parsed = feedbackId.parse(interaction.customId);
    if (!parsed) return;

    const modal = new ModalBuilder()
      .setCustomId(`feedback:submit:${parsed.ticketId}`)
      .setTitle("Feedback")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("message")
            .setLabel("What happened?")
            .setStyle(TextInputStyle.Paragraph),
        ),
      );

    await interaction.showModal(modal);
  },
});

export const submitFeedback = defineModalHandler({
  customIdPrefix: "feedback:submit:",
  async execute({ interaction }) {
    const message = interaction.fields.getTextInputValue("message");
    await interaction.reply(`Received feedback: ${message}`);
  },
});
