/* eslint-disable no-param-reassign */
// eslint-disable-next-line func-names
export default function (interaction) {
    /**
     * Send a interaction reply starting with a error emote
     * @param {string} option
     */
    interaction.error = (option) => new Promise((resolve, reject) => {
        // Check if the option is a object and if so update the content
        if (typeof (option) === 'object' && option.content) option.content = `:x: ${option.content}`;

        // Send the reply
        interaction.reply(typeof (option) === 'object' ? option : `:x: ${option}`)
            .then((int) => resolve(int))
            .catch((err) => reject(err));
    });

    /**
     * Send a interaction reply starting with a loading emote
     * @param {string} option
     */
    interaction.loading = (option) => new Promise((resolve, reject) => {
        // Check if the option is a object and if so update the content
        if (typeof (option) === 'object' && option.content) option.content = `:gear: ${option.content}`;

        // Send the reply
        interaction.reply(typeof (option) === 'object' ? option : `:gear: ${option}`)
            .then((int) => resolve(int))
            .catch((err) => reject(err));
    });

    /**
     * Send a interaction reply starting with a confirmation emote
     * @param {string} string
     */
    interaction.confirmation = (option) => new Promise((resolve, reject) => {
        // Check if the option is a object and if so update the content
        if (typeof (option) === 'object' && option.content) option.content = `:ok_hand: ${option.content}`;

        // Send the reply
        interaction.reply(typeof (option) === 'object' ? option : `:ok_hand: ${option}`)
            .then((int) => resolve(int))
            .catch((err) => reject(err));
    });
}
