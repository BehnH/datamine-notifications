import { stripIndents } from 'common-tags';
import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction, EmbedBuilder, EmbedField, PermissionFlagsBits,
} from 'discord.js';
import { DEFAULT_COLOR, OWNERS } from '../../config/constants';
import { ICommand } from '../../Interfaces/ICommand';
import { commands } from '../../modules/handlers/command';
import { InteractionResponseUtils } from '../../utils/InteractionResponseUtils';
import { TextUtils } from '../../utils/TextUtils';

const command: ICommand = {
    info: {
        name: 'help',
        description: 'Shows a list of commands or information about a specific command or category.',
        category: 'Information',
        selfPerms: [
            PermissionFlagsBits.EmbedLinks,
        ],
    },
    opts: {
        devOnly: false,
        disabled: false,
    },
    slash: {
        types: {
            chat: true,
        },
        opts: [{
            name: 'command_category',
            type: ApplicationCommandOptionType.String,
            description: 'The command or category you want to view the information of.',
            required: false,
        }],
        defaultPermission: true,
        dmPermission: true,
    },

    run: async (bot, interaction: ChatInputCommandInteraction) => {
        // Get all the command categories
        const getCategories = commands.map((c) => c.info.category.toLowerCase());
        const categories = getCategories.filter((item, index) => getCategories.indexOf(item) >= index);

        const find = interaction.options.getString('command_category') ?? '';

        // Get the command or category
        const foundCommand = commands.get(find);
        const category = categories[categories.indexOf(find)];

        // If the command or category is dev only return an error
        if ((foundCommand?.info.category.toLowerCase() === 'dev' || category === 'dev') && !OWNERS.includes(interaction.user.id)) return InteractionResponseUtils.error(interaction, "You didn't specify a valid command or category!", true);

        if (!interaction.options?.get('command_category')?.value || interaction.options?.get('command_category')?.value === 'all') {
            // Grab all the commands
            let commandsArray: Array<ICommand> = Array.from(commands.values());

            interface CategoryCommands {
                [key: string]: Array<ICommand>
            }
            // Define the catery object
            const categoryCommands: CategoryCommands = {};

            // If the user isn't a dev remove all the dev only commands
            if (!OWNERS.includes(interaction.user.id)) commandsArray = commandsArray.filter((c) => !c.opts.devOnly || !c.opts.disabled);

            // Sort the commands
            // eslint-disable-next-line no-nested-ternary
            const sorted = commandsArray.sort((a, b) => (a.info.category > b.info.category ? 1 : a.info.name > b.info.name && a.info.category === b.info.category ? 1 : 0));

            // Loop through the commands
            for (const x of sorted) {
                // Get the category name
                const commandCategory = x.info.category.toLowerCase();

                // Check if the array is already in the categories object
                if (!categoryCommands[commandCategory]) categoryCommands[commandCategory] = [];

                // Push the command to the category array
                categoryCommands[commandCategory].push(x);
            }

            // Build the embed
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${bot.user?.username} Commands`, iconURL: bot.user?.displayAvatarURL() ?? '' })
                .setThumbnail(bot.user?.displayAvatarURL() ?? '')
                .setDescription(`${!interaction.inGuild() ? '**-** Showing commands usable in DMs. To show all commands use `/help all`\n' : ''}**-** To use a command do \`/command\`.\n**-** Use \`/help <commandname>\` for additional details.\n**-** Commands labeled with a 🏆 are premium commands.`)
                .setColor(DEFAULT_COLOR);

            const fields: Array<EmbedField> = [];

            // Loop through the categories and add them as fields to the embed
            for (const [key, value] of Object.entries(categoryCommands)) {
                fields.push({
                    name: TextUtils.toTitleCase(key),
                    value: `\`/${value.map((a: ICommand) => a.info.name).join('`, `/')}\``,
                    inline: false,
                });
            }

            embed.addFields(fields);

            // Send the embed to the user
            (interaction.user?.send({ embeds: [embed] }) ?? interaction.user.send({ embeds: [embed] }))
                .then(() => InteractionResponseUtils.confirmation(interaction, "I've sent you a DM with a list of my commands!", true))
                .catch(() => InteractionResponseUtils.error(interaction, "Something went wrong, you most likely have your DM's disabled!", true));
        } else if (foundCommand) {
            // Define the description var
            let desc = '';

            // Build the embed description
            if (foundCommand.info.description) desc += `${foundCommand.info.description}\n`;
            if (foundCommand.info.category) desc += `\n**Category:** ${foundCommand.info.category}`;

            // Build the embed
            const embed = new EmbedBuilder()
                .setColor(DEFAULT_COLOR)
                .setTitle(`Command: /${foundCommand.info.name}`)
                .setDescription(desc)
                .setFooter({ text: 'Do not include <> or [] — They indicate <required> and [optional] arguments.' });

            // Send the embed
            interaction.reply({ embeds: [embed] });
        } else if (category) {
            // Get all the commands for the specified category
            const commandsList = commands.filter((c: ICommand) => c.info.category.toLowerCase() === category).map((c: ICommand) => `\`/${c.info.name}\``);

            // Build the Embed
            const embed = new EmbedBuilder()
                .setColor(DEFAULT_COLOR)
                .setTitle(`Category: ${category}`)
                .addFields([{ name: '**Commands**', value: commandsList.join(', ') }])
                .setFooter({ text: 'For more detailed information about a command use /help <command>' });

            // Send the embed
            interaction.reply({ embeds: [embed] });
        } else {
            // Send an error
            InteractionResponseUtils.error(interaction, "You didn't specify a valid command or category!", true);
        }
    },
};

export default command;
