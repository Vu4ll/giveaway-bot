const Discord = require("discord.js");
const client = new Discord.Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const { GiveawaysManager } = require("discord-giveaways");
const gManager = new GiveawaysManager(client, {
  storage: "./json/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#000001",
    embedColorEnd: "#2F3136",
    reaction: "🎉",
  },
});

global.client = client;
global.gManager = gManager;
global.config = require("./json/config.json");
client.commands = new Discord.Collection();
require("./util/event.js")(client);

client
  .login(global.config.TOKEN)
  .then(() => console.log(`${client.user.username} is ready!`))
  .catch((err) => console.error(`Failed to login! \n${err}`));

gManager.on("giveawayEnded", (giveaway, winners) => {
  console.log(
    `Giveaway #${giveaway.messageId} ended! Winners: ${winners
      .map((member) => member.user.username)
      .join(", ")}`
  );
});
