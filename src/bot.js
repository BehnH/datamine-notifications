import { Client } from 'discord.js';
import winston from 'winston';
import dotenv from 'dotenv';
import ora from 'ora';
import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import mongoose from 'mongoose';

import { init as commandInit } from './modules/handlers/command.js';
import { init as eventsInit } from './modules/handlers/event.js';

// Load env variables
dotenv.config();

// Instantiate the client
const bot = new Client({
    allowedMentions: {
        parse: ['users', 'roles'],
    },
    partials: ['CHANNEL', 'USER', 'GUILD_MEMBER'],
    intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_WEBHOOKS'],
});

// Log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level.toUpperCase()}: ${message}`);

// Logging levels
const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        debug: 2,
        ready: 3,
        cmd: 4,
    },
};

bot.logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
    ),
    transports: [new winston.transports.Console({ colorize: true })],
    levels: logLevels.levels,
    level: 'cmd',
});

// Define the init function
const init = async () => {
    // Log ascii art
    console.log(`
    88888888ba,                                                    88
    88      \`"8b               ,d                                  ""
    88        \`8b              88
    88         88 ,adPPYYba, MM88MMM ,adPPYYba, 88,dPYba,,adPYba,  88 8b,dPPYba,   ,adPPYba,
    88         88 ""     \`Y8   88    ""     \`Y8 88P'   "88"    "8a 88 88P'   \`"8a a8P_____88
    88         8P ,adPPPPP88   88    ,adPPPPP88 88      88      88 88 88       88 8PP"""""""
    88      .a8P  88,    ,88   88,   88,    ,88 88      88      88 88 88       88 "8b,   ,aa
    88888888Y"'   \`"8bbdP"Y8   "Y888 \`"8bbdP"Y8 88      88      88 88 88       88  \`"Ybbd8"'

                                                                                              `);

    // Import prototypes
    (await import('./modules/functions/prototypes.js')).default();

    // Setup & Instantiate the Sentry client
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [new Tracing.Integrations.Mongo()],
        tracesSampleRate: 1.0,
    });

    const commandMessage = ora('Loading commands').start();
    const cmds = await commandInit(bot);

    if (bot.commands.filter((a) => a?.enabled).size > 100) {
        commandMessage.stopAndPersist({
            symbol: '❌',
            text: 'Error while loading commands: There are over 100 commands with slash commands enabled!',
        });
    } else {
        commandMessage.stopAndPersist({
            symbol: '✔️',
            text: ` Loaded ${cmds} commands.`,
        });
    }

    const eventMessage = ora('Loading events').start();
    const events = await eventsInit(bot);

    eventMessage.stopAndPersist({
        symbol: '✔️',
        text: ` Loaded ${events} events.`,
    });

    // Send the MongoDB message
    const mongoMsg = ora('Connecting to MongoDB').start();

    // Connect to the mongo DB
    bot.mongo = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch((err) => {
        Sentry.captureException(err);
        throw new Error(err);
    });

    // Update the mongo message
    mongoMsg.stopAndPersist({
        symbol: '✔️',
        text: ' Successfully connected to the Mongo database!',
    });

    // Send the login message
    const loginMessage = ora('Logging into the Discord API...').start();

    // Login to the Discord API and update the login message
    bot.login(process.env.DISCORD_TOKEN)
        .then(() => {
            loginMessage.stopAndPersist({
                symbol: '✔️',
                text: ' Successfully logged into the Discord API!',
            });
        }).catch((err) => {
            loginMessage.stopAndPersist({
                symbol: '❌',
                text: `Error while logging into discord: ${err}`,
            });

            Sentry.captureException(err.stack);
        });
};

init();
