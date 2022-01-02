const Discord = require("discord.js");
const { GiveawaysManager } = require("discord-giveaways");
const fs = require("fs");
const cmdArray = [];

const client = new Discord.Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

const gManager = new GiveawaysManager(client, {
  storage: "./json/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#000001",
    embedColorEnd: "#2F3136",
    reaction: "🎉"
  }
});

global.client = client;
global.gManager = gManager;
global.config = require("./json/config.json");
client.commands = new Discord.Collection();

require("./util/event-handler.js")(client);

client
  .login(global.config.token)
  .then(() => console.log(`${client.user.username} ready!`))
  .catch(err =>
    console.error(`The bot could not be activated, an error occurred. \n${err}`)
  );

fs.readdir("./cmds/", (err, files) => {
  if (err) console.error(err);

  console.log(`${files.length} command will be loaded.`);

  files.forEach(f => {
    let props = require(`./cmds/${f}`);
    console.log(`Loaded command: ${props.config.name}`);
    client.commands.set(props.config.name, props);

    cmdArray.push({
      name: props.config.name,
      description: props.config.description,
      options: props.config.options
    });
  });
});

client.on("ready", () => {
  client.guilds.cache.forEach(x =>
    client.guilds.cache.get(x.id)?.commands.set(cmdArray)
  );
});

gManager.on("giveawayEnded", (giveaway, winners) => {
  console.log(
    `Giveaway #${giveaway.messageId} ended! Winners: ${winners
      .map(member => member.user.username)
      .join(", ")}`
  );
});
