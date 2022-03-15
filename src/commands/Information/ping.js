export default {
    info: {
        name: 'ping',
        description: 'Check the latency between the bot and Discord',
        category: 'Information',
    },
    perms: {
        permission: ['@everyone'],
        type: 'role',
        self: [],
    },
    opts: {
        guildOnly: false,
        disabled: false,
    },
    slash: {
        opts: [],
    },

    run: async (bot, interaction) => {
        // Send a message, once the message is sent edit it with the ping information
        interaction.reply(`:hearts: Current Ping: \`${Math.round(bot.ws.ping)}ms\``);
    },
};
