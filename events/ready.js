const client = global.client;
const Discord = require("discord.js");

module.exports = () => {
  client.user.setPresence({
    activities: [
      {
        name: `Developed By: 'Vu4ll#0870`
      }
    ],
    status: "idle"
  });
};

module.exports.config = { name: "ready" };
