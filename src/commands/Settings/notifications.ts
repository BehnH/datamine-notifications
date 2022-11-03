import { EmbedBuilder } from 'discord.js';
import commits from '../../database/models/commits.js';
import settings from '../../database/models/settings.js';

export default {
    info: {
        name: 'notifications',
        description: 'Sets the bot\'s notification settings',
        category: 'Settings',
    },
    perms: {
        permission: 'ADMINISTRATOR',
        type: 'discord',
        self: [],
    },
    opts: {
        guildOnly: false,
        disabled: false,
    },
    slash: {
        opts: [
            {
                name: 'channel',
                type: 'CHANNEL',
                description: 'The channel to send build notifications to',
                required: false,
                channelTypes: [
                    'GUILD_TEXT',
                    'GUILD_NEWS',
                ],
            },
        ],
    },

    run: async (bot, interaction) => {
        // Defer the reply to the interaction
        await interaction.deferReply({ ephemeral: true });

        // Get the channel, if provided
        const opt = interaction.options.get('channel')?.channel;

        if (!opt) {
            const { channel } = interaction.settings;

            if (!channel) return interaction.followUp({ content: 'No channel is configured for automatic build notifications!', ephemeral: true });
        }
    },
};
