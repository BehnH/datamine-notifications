/* eslint-disable func-names */
/* eslint-disable no-extend-native */
export default function () {
    String.prototype.toTitleCase = function () {
        let i;
        let j;
        let str;
        // eslint-disable-next-line prefer-arrow-callback
        str = this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        // Certain minor words should be left lowercase unless
        // they are the first or last words in the string
        const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
            'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
        for (i = 0, j = lowers.length; i < j; i += 1) {
            str = str.replace(
                new RegExp(`\\s${lowers[i]}\\s`, 'g'),
                // eslint-disable-next-line prefer-arrow-callback
                function (txt) {
                    return txt.toLowerCase();
                },
            );
        }

        // Certain words such as initialisms or acronyms should be left uppercase
        const uppers = ['Id', 'Tv'];
        for (i = 0, j = uppers.length; i < j; i += 1) {
            str = str.replace(
                new RegExp(`\\b${uppers[i]}\\b`, 'g'),
                uppers[i].toUpperCase(),
            );
        }
        return str;
    };
}
