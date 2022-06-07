const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const rest = new REST({ version: "10" }).setToken(global.config.TOKEN);

const slash = {
  register: async (clientId, commands) => {
    try {
      console.log(`Slash commands loading.`);

      await rest
        .put(Routes.applicationCommands(clientId), {
          body: commands,
        })
        .then(() => {
          console.log(`Slash commands loaded.`);
        });
    } catch (error) {
      console.error(`Failed to load slash commands. \n${error}`);
    }
  },
};

module.exports = slash;
