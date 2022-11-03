declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string
            GITHUB_TOKEN: string
            REDIS_URI: string
        }
    }
}

export { };
