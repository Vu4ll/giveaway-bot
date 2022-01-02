module.exports = {
  config: {
    name: "giveaway-end",
    description: "Ends a giveaway.",
    options: [
      {
        name: "giveaway",
        description: "The giveaway to end (message ID or giveaway prize)",
        type: "STRING",
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
              `You need to have the **manage messages** permissions to reroll giveaways.`
            )
            .setTitle(`❌ | Error`)
        ],
        ephemeral: true
      });

    const getGiveaway = interaction.options.getString("giveaway");

    const giveaway =
      global.gManager.giveaways.find(
        g => g.prize === getGiveaway && g.guildId === interaction.guild.id
      ) ||
      global.gManager.giveaways.find(
        g => g.messageId === getGiveaway && g.guildId === interaction.guild.id
      );

    if (!giveaway)
      return interaction.reply({
        embeds: [
          embed
            .setDescription(`Unable to find a giveaway for \`${getGiveaway}\``)
            .setTitle(`❌ | Error`)
        ],
        ephemeral: true
      });

    if (giveaway.ended)
      return interaction.reply({
        embeds: [
          embed
            .setDescription(`This giveaway is already ended.`)
            .setTitle(`❌ | Error`)
        ],
        ephemeral: true
      });

    global.gManager
      .end(giveaway.messageId)
      .then(() =>
        interaction.reply({
          embeds: [
            embed
              .setDescription(`Giveaway ended!`)
              .setTitle(`✅ | Successful`)
          ]
        })
      )
      .catch(e => {
        interaction.reply({
          embeds: [
            embed.setDescription(e).setTitle(`❌ | Something went wrong`)
          ],
          ephemeral: true
        });
      });
  }
};
