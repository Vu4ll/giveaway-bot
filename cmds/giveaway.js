const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Start a giveaway!")

    // Giveaway start command
    .addSubcommand((cmd) =>
      cmd
        .setName("start")
        .setDescription("Starts a giveaway")
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription(
              "How long the giveaway should last for. Example values: 1m, 1h, 1d"
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("How many winners the giveaway should have")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("What the prize of the giveaway should be")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to start the giveaway in")
            .setRequired(true)
        )
    )

    // Giveaway end command
    .addSubcommand((cmd) =>
      cmd
        .setName("end")
        .setDescription("Ends a giveaway")
        .addStringOption((option) =>
          option
            .setName("giveaway")
            .setDescription(
              "The giveaway to end (message ID or giveaway prize)"
            )
            .setRequired(true)
        )
    )

    // Giveaway pause command
    .addSubcommand((cmd) =>
      cmd
        .setName("pause")
        .setDescription("Pauses a giveaway")
        .addStringOption((option) =>
          option
            .setName("giveaway")
            .setDescription(
              "The giveaway to pause (message ID or giveaway prize)"
            )
            .setRequired(true)
        )
    )

    // Giveaway unpause command
    .addSubcommand((cmd) =>
      cmd
        .setName("unpause")
        .setDescription("Unpauses a giveaway")
        .addStringOption((option) =>
          option
            .setName("giveaway")
            .setDescription(
              "The giveaway to unpause (message ID or giveaway prize)"
            )
            .setRequired(true)
        )
    )

    // Giveaway reroll command
    .addSubcommand((cmd) =>
      cmd
        .setName("reroll")
        .setDescription("Rerolls a giveaway")
        .addStringOption((option) =>
          option
            .setName("giveaway")
            .setDescription(
              "The giveaway to reroll (message ID or giveaway prize)"
            )
            .setRequired(true)
        )
    ),

  run: async (client, interaction, embed) => {
    // Permission control
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              `You need to have the **manage messages** permissions to start giveaways.`
            )
            .setTitle(`❌ | Error`),
        ],
        ephemeral: true,
      });

    if (interaction.options.getSubcommand() === "start") {
      // Giveaway start command
      const gChannel = interaction.options.getChannel("channel");
      const gDuration = interaction.options.getString("duration");
      const gWinners = interaction.options.getInteger("winners");
      const gPrize = interaction.options.getString("prize");

      if (!gChannel.isText())
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`The selected channel is not a text channel!`)
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      global.gManager.start(gChannel, {
        duration: ms(gDuration),
        prize: gPrize,
        winnerCount: gWinners,
        hostedBy: interaction.user,
        messages: {
          giveaway: "🎉 Giveaway!",
          giveawayEnded: "🎉 Giveaway Ended!",
          inviteToParticipate: "React with 🎉 to participate!",
          drawing: "Drawing: {timestamp}",
          winMessage: `Congratulations, {winners}! You won **${gPrize}**!`,
          embedFooter: client.user.username,
          noWinner: "Giveaway cancelled, no valid participations.",
          hostedBy: `Hosted by: ${interaction.user}`,
          winners: "Winner(s):",
          endedAt: "Ended at",
        },
      });

      interaction.reply({
        embeds: [
          embed
            .setDescription(`Giveaway started in ${gChannel}!`)
            .setTitle(`✅ | Successful`),
        ],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "end") {
      // Giveaway end command
      const getGiveaway = interaction.options.getString("giveaway");

      const giveaway =
        global.gManager.giveaways.find(
          (g) => g.prize === getGiveaway && g.guildId === interaction.guild.id
        ) ||
        global.gManager.giveaways.find(
          (g) =>
            g.messageId === getGiveaway && g.guildId === interaction.guild.id
        );

      if (!giveaway)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(
                `Unable to find a giveaway for \`${getGiveaway}\``
              )
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      if (giveaway.ended)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`This giveaway is already ended.`)
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      global.gManager
        .end(giveaway.messageId)
        .then(() =>
          interaction.reply({
            embeds: [
              embed
                .setDescription(`Giveaway ended!`)
                .setTitle(`✅ | Successful`),
            ],
            ephemeral: true,
          })
        )
        .catch((e) => {
          interaction.reply({
            embeds: [
              embed.setDescription(e).setTitle(`❌ | Something went wrong`),
            ],
            ephemeral: true,
          });
        });
    } else if (interaction.options.getSubcommand() === "pause") {
      // Giveaway pause command
      const getGiveaway = interaction.options.getString("giveaway");

      const giveaway =
        global.gManager.giveaways.find(
          (g) => g.prize === getGiveaway && g.guildId === interaction.guild.id
        ) ||
        global.gManager.giveaways.find(
          (g) =>
            g.messageId === getGiveaway && g.guildId === interaction.guild.id
        );

      if (!giveaway)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(
                `Unable to find a giveaway for \`${getGiveaway}\``
              )
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      if (giveaway.pauseOptions.isPaused)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`This giveaway is already paused.`)
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      global.gManager
        .pause(giveaway.messageId)
        .then(() =>
          interaction.reply({
            embeds: [
              embed
                .setDescription(`Giveaway paused!`)
                .setTitle(`✅ | Successful`),
            ],
            ephemeral: true,
          })
        )
        .catch((e) => {
          interaction.reply({
            embeds: [
              embed.setDescription(e).setTitle(`❌ | Something went wrong`),
            ],
            ephemeral: true,
          });
        });
    } else if (interaction.options.getSubcommand() === "unpause") {
      // Giveaway unpause command
      const getGiveaway = interaction.options.getString("giveaway");

      const giveaway =
        global.gManager.giveaways.find(
          (g) => g.prize === getGiveaway && g.guildId === interaction.guild.id
        ) ||
        global.gManager.giveaways.find(
          (g) =>
            g.messageId === getGiveaway && g.guildId === interaction.guild.id
        );

      if (!giveaway)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(
                `Unable to find a giveaway for \`${getGiveaway}\``
              )
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      if (!giveaway.pauseOptions.isPaused)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`This giveaway is not paused.`)
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      global.gManager
        .unpause(giveaway.messageId)
        .then(() =>
          interaction.reply({
            embeds: [
              embed
                .setDescription(`Giveaway unpaused!`)
                .setTitle(`✅ | Successful`),
            ],
            ephemeral: true,
          })
        )
        .catch((e) => {
          interaction.reply({
            embeds: [
              embed.setDescription(e).setTitle(`❌ | Something went wrong`),
            ],
            ephemeral: true,
          });
        });
    } else if (interaction.options.getSubcommand() === "reroll") {
      // Giveaway reroll command
      const getGiveaway = interaction.options.getString("giveaway");

      const giveaway =
        global.gManager.giveaways.find(
          (g) => g.prize === getGiveaway && g.guildId === interaction.guild.id
        ) ||
        global.gManager.giveaways.find(
          (g) =>
            g.messageId === getGiveaway && g.guildId === interaction.guild.id
        );

      if (!giveaway)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(
                `Unable to find a giveaway for \`${getGiveaway}\``
              )
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      if (!giveaway.ended)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(`The giveaway is not ended yet.`)
              .setTitle(`❌ | Error`),
          ],
          ephemeral: true,
        });

      global.gManager
        .reroll(giveaway.messageId, {
          winnerCount: 1,
        })
        .then(() =>
          interaction.reply({
            embeds: [
              embed
                .setDescription(`Giveaway rerolled!`)
                .setTitle(`✅ | Successful`),
            ],
            ephemeral: true,
          })
        )
        .catch((e) => {
          interaction.reply({
            embeds: [
              embed.setDescription(e).setTitle(`❌ | Something went wrong`),
            ],
            ephemeral: true,
          });
        });
    }
  },
};
