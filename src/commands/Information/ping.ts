import { ICommand } from "../../Interfaces/ICommand";

const command: ICommand = {
    info: {
        name: 'ping',
        description: 'Check the latency between the bot and Discord',
        category: 'Information',
        selfPerms: []
    },
    opts: {
        devOnly: false,
        disabled: false,
    },
    slash: {
        types: {
            chat: true
        },
        opts: [],
        dmPermission: false,
        defaultPermission: true
    },

    run: async (bot, interaction) => {
        // Send a message, once the message is sent edit it with the ping information
        interaction.reply(`:hearts: Current Ping: \`${Math.round(bot.ws.ping)}ms\``);
    },
};

export default command;
