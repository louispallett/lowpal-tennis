/*
- - START OF SIGN UP - -
User signs up
    categories get added to USER
    user gets added to categories

- - END OF SIGN UP - -

- - START OF TEAM MATCHING - - 
# For doubles only

By (doubles) category
    Seeded players in one array
    Everyone else in another
        Randomize both objects
        Match 1 seeded with 1 non seeded until seeded.length == 0
        Match the remaining seeded with each other

- - END TEAM MATCHING - - 

- - START MATCH MAKING - -

# The way matches work is that we create them immediately after the team picker - we can use createTournament() to return the matches of the first round and 
# pass it again with null values for the next round. Each Match needs a 'pointer' to the next round apart from the final which is null. This is how we build the
# match array and I don't think it needs to be in any particular order.
# Each match does need a CATEGORY though, so we can filter them.
# In order to really understand them, it may just be better to work on the front end to visualize them!

Create match objects by category
    Fetch category and populate users (first name, last name)
    Get first round matches
    Get second round matches
    Map out and create matches (this may have to be done manually for the moment)


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
            category: categoryId,
            ranking: playerA.ranking + playerB.ranking,
        });
    }

    return teams;
}

module.exports = {createTeams, createMixedTeams};