/*
===========================================================================================
createTeam.js
-------------------------------------------------------------------------------------------

This has now been simplified to only push the player._id to a double array. The ranking is
now worked out in the controller function.

It also now handles the (rare) case where the number of seeded players is greater than the 
number of non-seeded players.

---
Variable seededHeavy
This refers to a case where the total number of seeded players is greater than the total number of 
non-seeded players.

Because the number of males and females (in mixed) must be equal and this is checked, there are only
three possible outcomes after the first loop matching seeded and non-seeded together:
    1. There are seeded players but NO non-seeded players remaining.
    2. There are non-seeded players but NO seeded players remaining.
    3. There are no players in either group remaining.
This means, when we go to the second loop, if seededHeavy is true, we match the remaining seeded
players together, otherwise we match the remaining non-seeded players together.

===========================================================================================
*/

const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const createMixedTeams = (
    maleSeeded, maleNonSeeded,
    femaleSeeded, femaleNonSeeded
) => {
    // This refers to a scenario where there are more seeded than non-seeded, in which case
    // we want to match until non-seeded players have run out. This should be a rare case
    const seededHeavy = maleSeeded + femaleSeeded > maleNonSeeded + femaleNonSeeded;

    const teams = [];

    // Randomize the players
    const maleSeededRand = shuffleArray(maleSeeded);
    const femaleSeededRand = shuffleArray(femaleSeeded);
    const maleNonSeededRand = shuffleArray(maleNonSeeded);
    const femaleNonSeededRand = shuffleArray(femaleNonSeeded);

    while (maleSeededRand.length > 0 && femaleNonSeededRand.length > 0) {
        const malePlayer = maleSeededRand.shift();
        const femalePlayer = femaleNonSeededRand.shift();
        teams.push([malePlayer, femalePlayer]);
    }

    while (femaleSeededRand.length > 0 && maleNonSeededRand.length > 0) {
        const femalePlayer = femaleSeededRand.shift();
        const malePlayer = maleNonSeededRand.shift();
        teams.push([femalePlayer, malePlayer]);
    }

    if (seededHeavy) {
        while (maleSeededRand.length > 0 && femaleSeededRand.length > 0) {
            const malePlayer = maleNonSeededRand.shift();
            const femalePlayer = femaleNonSeededRand.shift();
            teams.push([femalePlayer, malePlayer]);
        }
    } else {
        while (maleNonSeededRand.length > 0 && femaleNonSeededRand.length > 0) {
            const malePlayer = maleNonSeededRand.shift();
            const femalePlayer = femaleNonSeededRand.shift();
            teams.push([femalePlayer, malePlayer]);
        }
    }

    return teams;
}

const createTeams = (seeded, nonSeeded) => {
    const seededHeavy = seeded.length > nonSeeded.length;
    const teams = [];

    const seededRand = shuffleArray(seeded);
    const nonSeededRand = shuffleArray(nonSeeded);

    while (seededRand.length > 0 && nonSeededRand.length > 0) {
        const playerA = seededRand.shift();
        const playerB = nonSeededRand.shift();
        teams.push([playerA, playerB]);
    }

    if (seededHeavy) {
        while (seededRand.length > 1) {
            const playerA = seededRand.shift();
            const playerB = seededRand.shift();
            teams.push([playerA, playerB]);
        }
    } else {
        while (nonSeededRand.length > 1) {
            const playerA = nonSeededRand.shift();
            const playerB = nonSeededRand.shift();
            teams.push([playerA, playerB]);
        }
    }

    return teams;
}

module.exports = {createTeams, createMixedTeams};