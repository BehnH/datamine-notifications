// Import Dependencies
import ora from 'ora';
import { registerGlobal } from '../modules/handlers/command.js';
import CommitHandler from '../modules/handlers/commit.js';

export default async (bot) => {
    // Run the commit handler to get the latest commits
    await CommitHandler(bot);

    // Run the commit handler every 5 minutes to get the latest commits
    setInterval(() => {
        CommitHandler(bot);
    }, 60000 * 5);

    // Send the ready message
    const rdyMsg = ora('Getting bot ready...').start();

    // Set the bots status
    await bot.user.setPresence({ activities: [{ name: 'GitHub | /help', type: 'WATCHING' }], status: 'online' });

    // Register all the slash commands if the bot isn't in a dev environment
    await registerGlobal(bot);

    // Stop and update the ready message
    rdyMsg.stopAndPersist({
        symbol: '✔️',
        text: ` ${bot.user.username} is online on ${bot.guilds.cache.size} guilds!`,
    });

    // Send a spacer
    console.log(' ');
};
