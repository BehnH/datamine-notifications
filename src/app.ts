import { Client } from 'discord.js';
import dotenv from 'dotenv';
import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';

import { commands, init as commandInit } from './modules/handlers/command';
import { init as eventsInit } from './modules/handlers/event';
import logger from './logger';
import { INTENTS, PARTIALS } from './config/constants';
import { redis } from './database/redis';
import { createClient } from 'redis';

// Load env variables
dotenv.config();

// Instantiate the client
const bot = new Client({
    allowedMentions: {
        parse: ['users', 'roles'],
    },
    intents: INTENTS,
    partials: PARTIALS
});

export const redisClient = createClient({ url: process.env.REDIS_URI });

// Define the init function
const init = async () => {
    logger.info('Starting application')

    // Setup & Instantiate the Sentry client
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
    });

    logger.info('Attempting command init')
    await commandInit();

    if (commands.filter((a) => a?.slash.types.chat).size > 100) {
        logger.error('Unable to start - application has >100 slash commands')
    } else {
        logger.info('Loaded commands')
    }

    // Send the event message and load the events
    logger.info('Loading events');
    await eventsInit(bot);

    // Update the event message
    logger.info('Loaded events');

    // Send the login message
    logger.info('Logging into the Discord API...');


    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();

    console.log(redisClient.MEMORY_STATS);

    // Login to the Discord API and update the login message
    bot.login(process.env.BOT_TOKEN)
        .then(() => {
            logger.info('Logged into Discord');
        }).catch((err) => {
            logger.error('Failed to log into Discord');

            Sentry.captureException(err.stack);
        });
};

init();
