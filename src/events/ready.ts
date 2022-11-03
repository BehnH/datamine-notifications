// Import Dependencies
import { ActivityType } from 'discord.js';
import { commitHandler } from '../GitHubClient.js';
import { registerGlobal } from '../modules/handlers/command.js';


export default async (bot) => {
    // Run the commit handler to get the latest commits
    await commitHandler(bot);

    // Run the commit handler every 5 minutes to get the latest commits
    setInterval(() => {
        commitHandler(bot);
    }, 60000 * 5);

    // Set the bots status
    await bot.user.setPresence({ activities: [{ name: 'GitHub | /help', type: ActivityType.Watching }], status: 'online' });

    // Register all the slash commands if the bot isn't in a dev environment
    await registerGlobal(bot);

    // Send a spacer
    console.log(' ');
};

