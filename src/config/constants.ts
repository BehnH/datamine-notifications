import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';

/* * Bot Options * */
export const DEFAULT_LANGUAGE = 'en_US';
export const DEBUG_ENABLED = false;
export const OWNERS = ['648882989471891499'];
export const DEV_SERVER = ['686699491277013088'];

/* * Bot Constants * */
export const VERSION = '1.0.0';

export const DOMAIN = 'discord-data.behn.cc';
export const WEBSITE = `https://${DOMAIN}`;
export const INVITE_URL = `https://${DOMAIN}/invite`;

export const SUPPORT_SERVER = 'https://discord.gg/DwxCdXp276';
export const DEFAULT_COLOR = '#a4c5ea';
export const PRESENCE_TYPE = ActivityType.Watching;
export const PRESENCE_TEXT = `/help | ${DOMAIN}`;

/* * Shard Options * */
export const SHARDED = false;
export const SHARD_COUNT = 1;
export const SHARD_SPAWN_COMMAND = 'node';
export const SHARD_SPAWN_FILE = './app.js';

export const SHARD_MESSAGE_TIMEOUT = 0;

export const RESPAWN_DEAD_SHARDS = true;
export const EXIT_CODE_RESTART = 1;
export const EXIT_CODE_NO_RESTART = 69;

/* * Connection Info * */
export const INTENTS = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
];

export const PARTIALS = [
    Partials.GuildMember,
    Partials.User
];

/* * Discord Constants * */
export const DISCORD_EPOCH = 1420070400000;
export const CDN_BASE = 'https://cdn.discordapp.com/';
export const OPS_JOINLEAVE_ID = '1004877046985523262';
export const OPS_JOINLEAVE_SECRET = 'OoHZR3otThGKzbKnT6y7gOdWAxYqk60RO4W4-Y0oW3doi8XJ34hKfQTg-fYgdAE0Hmfs';

/* * Emojis * */
export const EMOJIS = {
    confirmation: "<a:checkmark:1026844593880301599>",
    error: "<a:error:1026844262463193210>"
}
