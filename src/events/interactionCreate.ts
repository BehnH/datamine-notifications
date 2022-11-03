/* eslint-disable no-param-reassign */
import { stripIndents } from 'common-tags';
import Sentry from '@sentry/node';
import { EmbedBuilder } from 'discord.js';

import { getSettings } from '../database/mongo.js';
import commits from '../database/models/commits.js';
import { ICommits } from '../database/interfaces/ICommits.js';

export default async (bot, interaction) => {
    if (interaction.isCommand()) {
        // Return if the user is a bot
        if (interaction.user.bot) return;

        // Assign the settings object to the interaction
        interaction.settings = await getSettings(interaction.guild?.id);

        // If the member isn't found try to fetch it
        if (interaction.guild && !interaction.member) await interaction.guild.members.fetch(interaction.user).catch(() => { });

        // Get the command
        const cmd = bot.commands.get(interaction.commandName);

        // If the command doesn't exist return an error
        if (!cmd) return interaction.error({ content: "The command you ran wasn't found!", ephemeral: true });
        // If the command is disabled return an error
        if (cmd.opts.disabled && !bot.config.general.devs.includes(interaction.user.id)) {
            // If disabled messages are enabled send one
            if (interaction.settings.general.disabled_message) {
                await interaction.error({ content: 'This command is currently disabled!', ephemeral: true });
            }

            // Return
            return;
        }
        // If a guildOnly command is run in dms return an error
        if (cmd.opts.guildOnly && !interaction.guildId) return interaction.error({ content: 'This command is unavailable via private messages. Please run this command in a guild.', ephemeral: true });

        // Try to run the command
        try {
            // Run the command
            await cmd.run(bot, interaction);
        } catch (err) {
            // Send the error to Sentry
            Sentry.captureException(err);

            // Log the error to console
            bot.logger.error(err.stack);

            // Send the error message to the user
            interaction.reply({
                content: stripIndents(`An error occurred while running the command: \`${err}\`
                    :question: If this issue persists please report it on GitHub: https://github.com/BehnH/Datamine-notifications/issues`),
                ephemeral: true,
            });
        }

        // Log that the command has been run
        bot.logger.cmd(`${interaction.user.tag} (${interaction.user.id}) ran command ${cmd.info.name}${interaction.guildId ? ` in ${interaction.guild.name} (${interaction.guildId})` : ''}`);
    } if (interaction.isButton()) {
        // Return if the user is a bot
        if (interaction.user.bot) return;

        /* if (interaction.customId.startsWith('post-channel')) {
            const data = interaction.customId.split('-');

            commits.findOne({ _id: data[2] })
                .then((commit) => {
                    // Create the embed
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: commit.title, iconURL: bot.user.displayAvatarURL({ format: 'png', dynamic: true }), url: commit.url })
                        .setColor('#abcdef')
                        .setDescription(commit.description)
                        .setTimestamp(new Date(commit.timestamp))
                        .setFooter({ text: commit.user.username, iconURL: commit.user.avatarURL });

                    interaction.reply({ embeds: [embed] });
                });
        }

        if (interaction.customId.startsWith('prev-page')) {
            const data = interaction.customId.split('-');
        }

        if (interaction.customId.startsWith('next-page')) {
            const data = interaction.customId.split('-');

            commits.findOne({ _id: data[2] })
                .then((commit) => {
                    // Get the page for the embed
                    const pages = Util.splitMessage(commit.description, { maxLength: 2048, char: '\n' });

                    console.log(pages);

                    // Create the embed
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: commit.title, iconURL: bot.user.displayAvatarURL({ format: 'png', dynamic: true }), url: commit.url })
                        .setColor('#abcdef')
                        .setDescription(commit.description)
                        .setTimestamp(new Date(commit.timestamp))
                        .setFooter({ text: commit.user.username, iconURL: commit.user.avatarURL });

                    interaction.reply({ embeds: [embed] });
                });
        } */
    }
};
