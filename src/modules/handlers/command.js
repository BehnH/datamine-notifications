import { Collection } from '@discordjs/collection';
import { readdirSync } from 'fs';

/**
 * Start the command handler and load all the commands.
 *
 * @param {Object} bot The client which is used to transact between this app & Discord
 *
 * @returns {Promise<Number>} The amount of commands loaded
 */
// eslint-disable-next-line no-async-promise-executor
export const init = (bot) => new Promise(async (resolve) => {
    // Create command and alias collections
    // eslint-disable-next-line no-param-reassign
    bot.commands = new Collection();

    // Get the category directories
    const categories = readdirSync('./src/commands');

    // Loop through the categories
    for await (const category of categories) {
        // Get all the commands
        const commands = readdirSync(`./src/commands/${category}`).filter((file) => file.endsWith('.js'));

        // Loop through the commands
        for (const file of commands) {
            // Import the command
            import(`../../commands/${category}/${file}`).then((cmd) => {
                // Clone the command object to a new object
                const obj = Object.create(cmd.default);

                // Set the command path
                obj.path = `../../commands/${category}/${file}`;
                // Register the command
                bot.commands.set(cmd.default.info.name, obj);
            }).catch((err) => {
                bot.logger.error(`Failed to load ${file}`);
                bot.logger.error(err.stack);
            });
        }
    }

    // Resolve the amount of commands that were added
    resolve(bot.commands.size);
});

/**
 * Register all global commands
 *
 * @param {Object} bot The client which is used to transact between this app & Discord
 *
 * @returns {Promise.<Boolean>} Returns true if the commands registered successfully
 */
export const registerGlobal = (bot) => new Promise((resolve, reject) => {
    const arr = [];
    const commands = Array.from(bot.commands.values());

    for (const data of commands) {
        arr.push({
            name: data.info.name,
            description: data.info.description,
            type: 'CHAT_INPUT',
            options: data.slash?.opts ?? [],
        });
    }

    // Set the guild commands
    bot.application.commands.set(arr).then(() => {
        resolve(true);
    }).catch((err) => {
        reject(err);
    });
});

/**
 * Register all guild commands
 *
 * @param {Object} bot The client which is used to transact between this app & Discord
 * @param {String} guildId The Guild to set the commands in
 *
 * @returns {Promise.<Boolean>} Returns true if the commands registered successfully
 */
export const registerGuild = (bot, guildId) => new Promise((resolve, reject) => {
    const arr = [];
    const commands = Array.from(bot.commands.values()).filter((c) => c.opts.guildOnly);

    for (const data of commands) {
        arr.push({
            name: data.info.name,
            description: data.info.description,
            options: data.slash?.opts ?? [],
        });
    }

    // Set the guild commands
    bot.application.commands.set(arr, guildId).then(() => {
        resolve(true);
    }).catch((err) => {
        reject(err);
    });
});
