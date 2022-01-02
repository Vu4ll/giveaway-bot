const ms = require("ms");

module.exports = {
  config: {
    name: "giveaway-start",
    description: "Starts a giveaway.",
    options: [
      {
        name: "duration",
        description:
          "How long the giveaway should last for. Example values: 1m, 1h, 1d",
        type: "STRING",
        required: true
      },
      {
        name: "winners",
        description: "How many winners the giveaway should have.",
        type: "INTEGER",
        required: true
      },
      {
        name: "prize",
        description: "What the prize of the giveaway should be.",
        type: "STRING",
        required: true
      },
      {
        name: "channel",
        description: "The channel to start the giveaway in",
        type: "CHANNEL",
        required: true
      }
    ]
  },

  run: async (client, interaction, embed, perm) => {
    if (!interaction.member.permissions.has(perm.FLAGS.MANAGE_MESSAGES))
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              `You need to have the **manage messages** permissions to start giveaways.`
            )
            .setTitle(`❌ | Error`)
        ],
        ephemeral: true
      });

    const gChannel = interaction.options.getChannel("channel");
    const gDuration = interaction.options.getString("duration");
    const gWinners = interaction.options.getInteger("winners");
    const gPrize = interaction.options.getString("prize");

    if (!gChannel.isText())
      return interaction.reply({
        embeds: [
          embed
            .setDescription(`The selected channel is not a text channel!`)
            .setTitle(`❌ | Error`)
        ],
        ephemeral: true
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
        endedAt: "Ended at"
      }
    });

    interaction.reply({
      embeds: [
        embed
          .setDescription(`Giveaway started in ${gChannel}!`)
          .setTitle(`✅ | Successful`)
      ]
    });
  }
};
