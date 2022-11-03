import {
    Client, CommandInteraction,
} from 'discord.js';

export interface ICommand {
    info: {
        name: string,
        description: string,
        category: Category,
        selfPerms: bigint[],
    },
    opts: {
        devOnly: boolean,
        disabled: boolean,
    },
    slash: {
        types: {
            chat: boolean,
        },
        opts: any[],
        defaultPermission: boolean,
        dmPermission: boolean
    },
    run(bot: Client, interaction: CommandInteraction): any,
}

type Category = 'Datamining' |
    'Information' |
    'Settings';