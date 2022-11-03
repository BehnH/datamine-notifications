import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { getLatestCommit } from '../../GitHubClient';
import { ICommand } from '../../Interfaces/ICommand';

const command: ICommand = {
    info: {
        name: 'latest',
        description: 'Get a information about the latest published build',
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
        opts: [],
        defaultPermission: true,
        dmPermission: true
    },

    run: async (bot, interaction) => {
        // Defer the interaction
        await interaction.deferReply({ ephemeral: true });

        // Get the latest commit
        const commit = await getLatestCommit();

        // Define images & commants variables
        const images = commit.images;

        const description = commit.commit.message.replace('## Strings', '');

        // Create the component row
        const row = new ActionRowBuilder<ButtonBuilder>();

        if (commit.commit.message.length > 2048) {
            row
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`prev-page-${commit._id}`)
                        .setLabel('Previous Page')
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`post-channel-${commit._id}`)
                        .setLabel('Post to channel')
                        .setStyle(ButtonStyle.Primary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`next-page-${commit._id}-2`)
                        .setLabel('Next page')
                        .setStyle(ButtonStyle.Success),
                );
        } else {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`post-channel-${commit._id}`)
                    .setLabel('Post to channel')
                    .setStyle(ButtonStyle.Primary),
            );
        }

        // Create the embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: commit.title, iconURL: bot.user?.displayAvatarURL(), url: commit.url })
            .setColor('#abcdef')
            .setDescription(description)
            .setTimestamp(new Date(commit.commit.author.date))
            .setFooter({ text: 'Build #' + commit.buildNumber });

        interaction.followUp({ components: [row], embeds: [embed], ephemeral: true }).catch((err) => console.error(err));

        // Send each image chunk
        if (images?.length) images.map((chunk) => interaction.followUp({ content: chunk, ephemeral: true }).catch((err) => console.error(err)));
    },
};

export default command;
