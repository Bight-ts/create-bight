import { SlashCommandBuilder } from "discord.js";
import { defineCommand } from "@bight-ts/core";

export default defineCommand({
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload bot state."),
  preconditions: ["admin-only"],
  async execute({ interaction }) {
    await interaction.reply("Reloading...");
  },
});
