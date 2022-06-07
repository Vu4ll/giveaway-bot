const client = global.client;

module.exports = {
  event: "ready",
  run: async () => {
    client.user.setPresence({
      activities: [
        {
          name: `Developed By: Vu4ll`,
        },
      ],
      status: "idle",
    });

    require("../util/command")(client);
  },
};
