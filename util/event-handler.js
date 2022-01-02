const fs = require("fs");

module.exports = async client => {
  fs.readdir("./events", (err, files) => {
    console.log(`${files.length} events will be loaded.`);
    
    files.forEach(file => {
      let props = require(`../events/${file}`);
      if (!props.config.name) return;
      client.on(props.config.name, props);
      console.log(`Loaded event: ${props.config.name}.`);
    });
  });
};
