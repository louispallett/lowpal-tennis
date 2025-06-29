const shufflePlayers = (players:string[]):string[] => {
    const arr = [...players];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// We have to pass these filtered arguments here because we only want to work with 
// the _id values (strings), rather than full PlayerType objects
export function createMixedTeams(
    maleSeeded:string[], maleNonSeeded:string[],
    femaleSeeded:string[], femaleNonSeeded:string[]
):string[][] {
    // This refers to a scenario where there are more seeded than non-seeded, in which case
    // we want to match until non-seeded players have run out. This should be a rare case
    const seededHeavy = maleSeeded.length + femaleSeeded.length > maleNonSeeded.length + femaleNonSeeded.length;

    const teams = [];

    // Randomize the players
    const maleSeededRand = shufflePlayers(maleSeeded);
    const femaleSeededRand = shufflePlayers(femaleSeeded);
    const maleNonSeededRand = shufflePlayers(maleNonSeeded);
    const femaleNonSeededRand = shufflePlayers(femaleNonSeeded);

    while (maleSeededRand.length > 0 && femaleNonSeededRand.length > 0) {
        const malePlayer = maleSeededRand.shift();
        const femalePlayer = femaleNonSeededRand.shift();
        if (malePlayer !== undefined && femalePlayer !== undefined) {
            teams.push([malePlayer, femalePlayer]);
        }
    }

    while (femaleSeededRand.length > 0 && maleNonSeededRand.length > 0) {
        const femalePlayer = femaleSeededRand.shift();
        const malePlayer = maleNonSeededRand.shift();
        if (malePlayer !== undefined && femalePlayer !== undefined) {
            teams.push([femalePlayer, malePlayer]);
        }
    }

    if (seededHeavy) {
        while (maleSeededRand.length > 0 && femaleSeededRand.length > 0) {
            const malePlayer = maleNonSeededRand.shift();
            const femalePlayer = femaleNonSeededRand.shift();
            if (malePlayer !== undefined && femalePlayer !== undefined) {
                teams.push([femalePlayer, malePlayer]);
            }
        }
    } else {
        while (maleNonSeededRand.length > 0 && femaleNonSeededRand.length > 0) {
            const malePlayer = maleNonSeededRand.shift();
            const femalePlayer = femaleNonSeededRand.shift();
            if (malePlayer !== undefined && femalePlayer !== undefined) {
                teams.push([femalePlayer, malePlayer]);
            }
        }
    }

    return teams;
}

export function createTeams(
    seeded:string[], nonSeeded:string[]
):string[][] {
    const seededHeavy = seeded.length > nonSeeded.length;
    const teams = [];

    const seededRand = shufflePlayers(seeded);
    const nonSeededRand = shufflePlayers(nonSeeded);

    while (seededRand.length > 0 && nonSeededRand.length > 0) {
        const playerA = seededRand.shift();
        const playerB = nonSeededRand.shift();
        if (playerA !== undefined && playerB !== undefined) {
            teams.push([playerA, playerB]);
        }
    }

    if (seededHeavy) {
        while (seededRand.length > 1) {
            const playerA = seededRand.shift();
            const playerB = seededRand.shift();
            if (playerA !== undefined && playerB !== undefined) {
                teams.push([playerA, playerB]);
            }
        }
    } else {
        while (nonSeededRand.length > 1) {
            const playerA = nonSeededRand.shift();
            const playerB = nonSeededRand.shift();
            if (playerA !== undefined && playerB !== undefined) {
                teams.push([playerA, playerB]);
            }
        }
    }

    return teams;
}