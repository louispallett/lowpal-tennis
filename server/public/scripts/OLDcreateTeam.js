/*
--- Need to re-work ---

We want to simplify this - what do we ultimately need from this? Only the PLAYER IDs. So, we can pass the 
player _ids as an array into the function.

However, we will need to split into the critical parts - 
    seeded
    non-seeded

And for mixed teams:

    male
        seeded
        non-seeded
    female
        seeded
        non-seeded

So, passing in those as arguments. We can then work from there!
*/

const mongoose = require("mongoose");

const createMixedTeams = (category) => {
    // Filter out our players so we are left with seeded males and females, and non-seeded males and females
    const seededPlayers = category.players.filter(player => player.seeded);
    const notSeededPlayers = category.players.filter(player => !player.seeded);
    let seededFemale = seededPlayers.filter(player => !player.male);
    let seededMale = seededPlayers.filter(player => player.male);
    let notSeededFemale = notSeededPlayers.filter(player => !player.male);
    let notSeededMale = notSeededPlayers.filter(player => player.male);  

    if ((seededPlayers.length + notSeededPlayers.length) % 2 != 0) throw new Error("Number of players must be even");
    if ((seededMale.length + notSeededMale.length) != (seededFemale.length + notSeededFemale.length)) throw new Error("Number of female and male players must be even");

    const teams = [];
    seededFemale = seededFemale.sort(() => Math.random() - 0.5);
    seededMale = seededMale.sort(() => Math.random() - 0.5);
    notSeededFemale = notSeededFemale.sort(() => Math.random() - 0.5);
    notSeededMale = notSeededMale.sort(() => Math.random() - 0.5);

    while (seededFemale.length > 0 && notSeededMale.length > 0) {
        const femalePlayer = seededFemale.shift();
        const malePlayer = notSeededMale.shift();
        teams.push({
            _id: new mongoose.Types.ObjectId().toHexString(),
            players: [femalePlayer, malePlayer],
            name: `${malePlayer.firstName[0]}. ${malePlayer.lastName} and ${femalePlayer.firstName[0]}. ${femalePlayer.lastName}`,
            category: category._id,
            ranking: femalePlayer.ranking + malePlayer.ranking,
        });
    }

    while (seededMale.length > 0 && notSeededFemale.length > 0) {
        const malePlayer = seededMale.shift();
        const femalePlayer = notSeededFemale.shift();
        teams.push({
            _id: new mongoose.Types.ObjectId().toHexString(),
            players: [femalePlayer, malePlayer],
            name: `${malePlayer.firstName[0]}. ${malePlayer.lastName} and ${femalePlayer.firstName[0]}. ${femalePlayer.lastName}`,
            category: category._id,
            ranking: femalePlayer.ranking + malePlayer.ranking,
        });
    }

    while (notSeededFemale.length > 0 && notSeededMale.length > 0) {
        const malePlayer = notSeededMale.shift();
        const femalePlayer = notSeededFemale.shift();
        teams.push({
            _id: new mongoose.Types.ObjectId().toHexString(),
            players: [femalePlayer, malePlayer],
            name: `${malePlayer.firstName[0]}. ${malePlayer.lastName} and ${femalePlayer.firstName[0]}. ${femalePlayer.lastName}`,
            category: category._id,
            ranking: femalePlayer.ranking + malePlayer.ranking,
        });
    }

    return teams;
}

const createTeams = (category) => {
    // TODO: This function works on the assumption that notSeeded exists and it is greater than seeded
    // console.log(category.players);
    let seeded = category.players.filter(player => player.seeded);
    const notSeeded = category.players.filter(player => !player.seeded);
    if (!seeded) seeded = [];
    if (!notSeeded) throw new Error("No non-seeded players found");
    // console.log(seeded, notSeeded);

    const teams = matchDoublesPairs(category._id, seeded, notSeeded);

    return teams;
}

// This function assumes seeded.length < notSeeded.length
const matchDoublesPairs = (categoryId, seeded, notSeeded) => {

    // I.e. total number of players is not even
    if ((seeded.length + notSeeded.length) % 2 != 0) return new Error("Number of players must be even");

    // Note that seeded and notSeeded must be arrays
    seeded = seeded.sort(() => Math.random() - 0.5);
    notSeeded = notSeeded.sort(() => Math.random() - 0.5);
    const teams = [];

    while (seeded.length > 0 && notSeeded.length > 0) {
        const playerA = seeded.shift();
        const playerB = notSeeded.shift();
        teams.push({
            _id: new mongoose.Types.ObjectId().toHexString(),
            players: [playerA, playerB],
            name: `${playerA.firstName[0]}. ${playerA.lastName} and ${playerB.firstName[0]}. ${playerB.lastName}`,
            category: categoryId,
            ranking: playerA.ranking + playerB.ranking,
        })
    }

    // Remaining nonSeeded matched
    while (notSeeded.length > 1) {
        const playerA = notSeeded.shift();
        const playerB = notSeeded.shift();
        teams.push({
            _id: new mongoose.Types.ObjectId().toHexString(),
            players: [playerA, playerB],
            name: `${playerA.firstName[0]}. ${playerA.lastName} and ${playerB.firstName[0]}. ${playerB.lastName}`,
            category: categoryId,
            ranking: playerA.ranking + playerB.ranking,
        });
    }

    return teams;
}

module.exports = {createTeams, createMixedTeams};