import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { defineAppCommand, defineAppSubcommand } from "~/bight.js";

const showGuildConfig = defineAppSubcommand({
  name: "show",
  description: "Show the stored guild config.",
  async execute({ interaction, context }) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a guild.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const config = await context.services.storage.guilds.ensure(interaction.guildId, {
      prefix: "!",
      featureFlags: {},
    });
    await interaction.reply({
      content: `Stored guild config: \`${JSON.stringify(config)}\``,
      flags: MessageFlags.Ephemeral,
    });
  },
});

const setGuildPrefix = defineAppSubcommand({
  name: "set-prefix",
  description: "Store a sample prefix value.",
  build(builder) {
    return builder.addStringOption((option) =>
      option
        .setName("value")
        .setDescription("Prefix to store")
        .setRequired(true),
    );
  },
  async execute({ interaction, context }) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a guild.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const prefix = interaction.options.getString("value", true);
    const updated = await context.services.storage.guilds.patch<{ prefix: string }>(
      interaction.guildId,
      {
      prefix,
      },
    );
    await interaction.reply({
      content: `Updated guild config: \`${JSON.stringify(updated)}\``,
      flags: MessageFlags.Ephemeral,
    });
  },
});

export default defineAppCommand({
  data: new SlashCommandBuilder()
    .setName("guild-config")
    .setDescription("Store or inspect guild-scoped config."),
  subcommands: [showGuildConfig, setGuildPrefix],
});
