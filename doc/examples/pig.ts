const readline = require('readline');

interface Options {
    players: number;
    goal: number;
    dice: number;
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const pig = async (options: Options): Promise<number> => {
    const scores: number[] = '0'.repeat(options.players).split('').map(Number);
    const won = () => scores.findIndex((score) => score >= options.goal);
    const roll = (player: number) => rand(1, options.dice);
    const hold = async (): Promise<boolean> => {
        const read = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const ask = (question: string): Promise<boolean> => {
            return (new Promise((rs) => {
                read.question(question, rs);
            }))
                .then((answer: string) => answer.toLowerCase() !== 'h');
        };

        try {
            return !await ask('    ...keep rolling or hold [Rh]?');
        } finally {
            read.close();
        }
    };

    const turn = async (player: number, score: number): Promise<number> => {
        let total = 0;

        console.log(`Player ${player + 1}:`);

        for (; ;) {
            const rolled = roll(player);

            console.log(`    `, (rolled === 1) ? '(V.V)' : `${rolled} (${total + rolled})`);

            if (rolled === 1) {
                total = 0;
                break;
            }

            total += rolled;

            if ((score + total) >= options.goal) {
                break;
            }

            if (await hold()) {
                break;
            }
        }

        return total;
    };

    let winner;
    let player = 0;

    do {
        scores[player] += await turn(player, scores[player]);
        console.log(`Player ${player + 1} scores ${scores[player]}.`);

        player = (player + 1) % options.players;
        winner = won();
    } while (winner < 0);

    console.log(`Player ${winner + 1} wins!`);

    return winner;
};

pig({
    players: 2,
    goal: 100,
    dice: 6,
});
