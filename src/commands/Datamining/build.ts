import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import commits from '../../database/models/commits.js';
import { ICommand } from '../../Interfaces/ICommand.js';

const command: ICommand = {
    info: {
        name: 'build',
        description: "Get a specific build number's information",
        category: 'Datamining',
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
        opts: [
            {
                name: 'build',
                type: 'INTEGER',
                description: 'The build number to get information for',
                required: true,
            },
        ],
        defaultPermission: true,
        dmPermission: true
    },

    run: async (bot, interaction: ChatInputCommandInteraction) => {
        // Defer the reply to the interaction
        await interaction.deferReply({ ephemeral: true });

        // Get the build number
        const build = interaction.options.getNumber('build', true)

        // Get the commit from the Database
        const commit = await commits.findOne({ buildNumber: build });

        if (!commit) return interaction.followUp({ content: 'No commit found for that build number.', ephemeral: true });

        // Define images variable
        const img = commit.images;

        // Create the embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: commit.title, iconURL: bot.user?.displayAvatarURL(), url: commit.url })
            .setColor('#abcdef')
            .setDescription(commit.commit.message)
            .setTimestamp(new Date(commit.commit.author.date))
            .setFooter({ text: 'Build #' + commit.buildNumber });

        interaction.followUp({ embeds: [embed], ephemeral: true }).catch((err) => console.error(err));

        // Send each image chunk
        if (img?.length) img.map((chunk) => interaction.followUp({ content: chunk, ephemeral: true }).catch((err) => console.error(err)));
    },
};

export default command;
