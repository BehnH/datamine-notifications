import permissions from './models/permissions.js';
import settings from './models/settings.js';

/**
 * Returns the settings of the specified Guild (or creates them if they don't exist)
 *
 * @param {String} guild The Guild ID to get the settings for
 *
 * @returns {Promise<Object>} Guild Data
 */
export const getSettings = async (guild) => {
    // If the command is run in dms return default settings
    // eslint-disable-next-line new-cap
    if (!guild) return new settings();

    // Get the guild data
    const data = await settings.findOne({ _id: guild });

    // If guild data was found return it, otherwise create it
    if (data) {
        return data;
    }
    // eslint-disable-next-line new-cap
    const guildSettingsData = await new settings({
        _id: guild,
    }).save();

    return guildSettingsData;
};

/**
 * Get the permissions for the specified Guild
 *
 * @param {Object} bot The client which is used to transact between this app & Discord
 * @param {String} guild The Guild ID to get the permissions for
 *
 * @returns {Promise<Object>} Permission Data
 */
export const getPerms = async (bot, guild) => {
    // Define the defaults and return objects
    const defaults = {};
    const commandPerms = {};

    // Loop through the commands and set the defaults
    for (const command of Array.from(bot.commands.values())) {
        defaults[command.info.name] = {
            permission: command.perms.permission,
            type: command.perms.type,
        };
    }

    // If the command was in DMs return the defaults
    if (!guild) return defaults;

    // Get the guild data
    let guildData = await permissions.findOne({ _id: guild });

    // If there is no guild data create the database object
    if (!guildData) {
        // eslint-disable-next-line new-cap
        guildData = await new permissions({
            _id: guild,
        }).save();
    }

    // Create the return object
    Object.keys(defaults).forEach((key) => {
        commandPerms[key] = guildData.permissions?.commands?.[key] ?? defaults[key];
    });

    // Return the return object
    return {
        commands: commandPerms,
        categories: guildData.permissions?.categories ?? {},
    };
};
