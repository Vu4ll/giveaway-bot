const client = global.client;
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = async interaction => {
  const embed = new MessageEmbed()
    .setFooter(
      `${interaction.user.tag}`,
      interaction.user.avatarURL({ dynamic: true })
    )
    .setColor("BLACK")
    .setTimestamp();

  if (!interaction.isCommand()) return;

  const perm = Permissions;
  const command = client.commands.get(interaction.commandName);

  if (!command)
    return interaction.reply({
      embeds: [
        embed
          .setDescription(`Command \`${interaction.commandName}\` not found.`)
          .setTitle(`❌ | Error`)
      ],
      ephemeral: true
    });

  command.run(client, interaction, embed, perm);
};

module.exports.config = { name: "interactionCreate" };
