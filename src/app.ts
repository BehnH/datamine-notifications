import { Client, GatewayIntentBits, Partials } from 'discord.js';
import winston from 'winston';
import dotenv from 'dotenv';
import ora from 'ora';
import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import mongoose from 'mongoose';

import { commands, init as commandInit } from './modules/handlers/command';
import { init as eventsInit } from './modules/handlers/event';
import logger from './logger';
import { getMongooseURL, init as dbInit } from './database/mongo';

// Load env variables
dotenv.config();

// Instantiate the client
const bot = new Client({
    allowedMentions: {
        parse: ['users', 'roles'],
    },
    partials: [Partials.User],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildWebhooks],
});

// Initialize Mongo connection
const mongooseUrl = getMongooseURL(process.env.MONGODB_USERNAME, process.env.MONGODB_PASSWORD, process.env.MONGODB_HOST, process.env.MONGODB_PORT, process.env.MONGODB_DATABASE);
export const db = dbInit(mongooseUrl)
    .then(() => logger.debug('Successfully started DB'))
    .catch((err) => logger.error('Failed to connect to Mongo:', err));

// Define the init function
const init = async () => {
    logger.info('Starting application')

    // Setup & Instantiate the Sentry client
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [new Tracing.Integrations.Mongo()],
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
