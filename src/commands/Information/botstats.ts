import { stripIndents } from 'common-tags';
import { formatDistance } from 'date-fns';
import { EmbedBuilder, GuildMember, PermissionFlagsBits, version } from 'discord.js';
import mongoose from 'mongoose';
import os from 'os';
import { ICommand } from '../../Interfaces/ICommand';
import { commands } from '../../modules/handlers/command';

const command: ICommand = {
    info: {
        name: 'botstats',
        description: 'View stats for the Bot',
        category: 'Information',
        selfPerms: [ PermissionFlagsBits.EmbedLinks ]
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
        dmPermission: true,
        defaultPermission: true
    },

    run: async (bot, interaction) => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${bot.user?.username}`, iconURL: bot.user?.displayAvatarURL() })
            .setColor((interaction.member as GuildMember)?.displayColor || '#6FD6FF')
            .setDescription(stripIndents`Developed By: [\`Behn#0001\`](https://discord.com/users/648882989471891499)

            Uptime: **<t:${bot.uptime}:R>**
            Database State: ${mongoose.connection.readyState === 1 ? 'Healthy' : 'Unhealthy'}
            Commands: **${commands.size}**
            Memory Usage: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1024 / 1024) > 1024 ? `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(os.totalmem() / 1024 / 1024).toFixed(2)}`}** | Ping: **${bot.ws.ping}ms**
            **${bot.guilds.cache.size.toLocaleString()}** servers | **${bot.channels.cache.size.toLocaleString()}** channels | **${bot.users.cache.size.toLocaleString()}** users

            **Dependencies**
            Discord.js **v${version}** | Node.js **${process.version}**`);

        // Send the embed
        interaction.reply({ embeds: [embed] });
    },
};

export default command;
