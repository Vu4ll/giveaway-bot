const client = global.client;
const { MessageEmbed } = require("discord.js");

module.exports = {
  event: "interactionCreate",
  run: async (interaction) => {
    const command = client.commands.get(interaction.commandName);

    const embed = new MessageEmbed()
      .setFooter({
        text: `${interaction.user.tag}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      })
      .setColor("BLACK")
      .setTimestamp();

    if (interaction.isCommand()) command.run(client, interaction, embed);
  },
};
