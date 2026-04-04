import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { defineAppCommand } from "~/bight.js";

export default defineAppCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong and increments a counter."),
  cooldown: 5,
  async execute({ interaction, context }) {
    const total = ((await context.services.storage.global.get<number>("pingCount")) ?? 0) + 1;
    await context.services.storage.global.set("pingCount", total);
    await interaction.reply({
      content: `Pong. Total pings recorded: ${total}.`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
