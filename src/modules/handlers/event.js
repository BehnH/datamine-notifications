import { readdirSync } from 'fs';

/**
 * Start the event handler and load all events.
 *
 * @param {Object} bot The client which is used to transact between this app & Discord
 *
 * @returns {Promise<Number>} The amount of events loaded
 */
// eslint-disable-next-line import/prefer-default-export, no-async-promise-executor
export const init = (bot) => new Promise(async (resolve) => {
    // Get all the event files
    const files = readdirSync('./src/events').filter((file) => file.endsWith('.js'));

    // Loop through the files
    for (const data of files) {
        // Get the event name and the event file
        const eventName = data.split('.')[0];
        // eslint-disable-next-line import/no-dynamic-require, global-require
        import(`../../events/${data}`).then((module) => {
            if (eventName === 'ready') {
                // Only fire the ready event once
                bot.once(eventName, module.default.bind(null, bot));
            } else {
                // Run the event
                bot.on(eventName, module.default.bind(null, bot));
            }
        }).catch((err) => {
            // Log the error in case loading a event fails
            bot.logger.error(`Failed to load ${data}`);
            bot.logger.error(err.stack);
        });
    }

    // Resolve the amount of events that were loaded
    resolve(files.length);
});
