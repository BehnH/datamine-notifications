import { createClient } from "redis";

export const redis = async (redisUri: string) => {
    const redisClient = createClient({
        url: redisUri,
    });

    redisClient.on("error", (error) => {
        throw new Error("Redis Error: " + error);
    });

    await redisClient.connect();

    return redisClient;
}
