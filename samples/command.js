const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName() // Command name
    .setDescription(), // Command description
  // For more options: https://discordjs.guide/interactions/slash-commands.html#parsing-options

  run: async (client, interaction, embed) => {
    // Code here
  },
};
