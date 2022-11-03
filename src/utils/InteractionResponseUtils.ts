import { ButtonInteraction, CommandInteraction } from "discord.js";
import { EMOJIS } from "../config/constants";

type InteractionResponseUtilsOptions = {
    interaction: CommandInteraction | ButtonInteraction,
    ephemeral?: boolean,
    content: string
};

export class InteractionResponseUtils {
    /**
     *
     * @param interaction The interaction to reply to
     * @param content The content to send in the reply
     * @param ephemeral Whether this should be sent as an ephemeral response
     * @returns
     */
    static error(interaction: InteractionResponseUtilsOptions['interaction'], content: InteractionResponseUtilsOptions['content'], ephemeral: InteractionResponseUtilsOptions['ephemeral']): Promise<unknown> {
        return new Promise((resolve, reject) => {
            interaction.reply({ content: EMOJIS.error + content, ephemeral: (ephemeral ?? false) })
                .then((int: unknown) => resolve(int))
                .catch((err: any) => reject(err));
        });
    }

    /**
     *
     * @param interaction The interaction to reply to
     * @param content The content to send in the reply
     * @param ephemeral Whether this should be sent as an ephemeral response
     * @returns
     */
    static confirmation(interaction: InteractionResponseUtilsOptions['interaction'], content: InteractionResponseUtilsOptions['content'], ephemeral: InteractionResponseUtilsOptions['ephemeral']): Promise<unknown> {
        return new Promise((resolve, reject) => {
            interaction.reply({ content: EMOJIS.confirmation + content, ephemeral: (ephemeral ?? false) })
                .then((int: unknown) => resolve(int))
                .catch((err: any) => reject(err));
        });
    }
}