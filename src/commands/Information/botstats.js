import { stripIndents } from 'common-tags';
import { formatDistance } from 'date-fns';
import { MessageEmbed, version } from 'discord.js';
import mongoose from 'mongoose';
import os from 'os';

export default {
    info: {
        name: 'botstats',
        description: 'View stats for the Bot',
        category: 'Information',
    },
    perms: {
        permission: ['@everyone'],
        type: 'role',
        self: ['EMBED_LINKS'],
    },
    opts: {
        guildOnly: false,
        disabled: false,
    },
    slash: {
        opts: [],
    },

    run: async (bot, interaction) => {
        // Get and format the bot uptime
        const uptime = formatDistance(0, bot.uptime);

        // Build the embed
        const embed = new MessageEmbed()
            .setAuthor({ name: `${bot.user.username} v`, iconURL: bot.user.displayAvatarURL({ format: 'png', dynamic: true }) })
            .setColor(interaction.member?.displayColor || '#6FD6FF')
            .setDescription(stripIndents`Developed By: [\`Waitrose#0001\`](https://discord.com/users/648882989471891499)

            Uptime: **${uptime}**
            Database State: ${mongoose.connection.readyState === 1 ? 'Healthy' : 'Unhealthy'}
            Commands: **${bot.commands.size}**
            Memory Usage: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1024 / 1024) > 1024 ? `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(os.totalmem() / 1024 / 1024).toFixed(2)}`}** | Ping: **${bot.ws.ping}ms**
            **${bot.guilds.cache.size.toLocaleString()}** servers | **${bot.channels.cache.size.toLocaleString()}** channels | **${bot.users.cache.size.toLocaleString()}** users

            **Dependencies**
            Discord.js **v${version}** | Node.js **${process.version}**`);

        // Send the embed
        interaction.reply({ embeds: [embed] });
    },
};
