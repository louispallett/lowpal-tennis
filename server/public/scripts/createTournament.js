/* 
This function is based on the assumption that the 'teams' parameter going into it is ranked on skill. 
1           being highest skilled
length - 1  being least skilled
Teams should be an array of teams.

NOTE: createRound just returns the next round players. So, if you have just 2 matches for the first round, it will return those four players.

BUT because it then returns to a perfect power of 2 (2, 4, 8, 16, 32, etc.), it will calculate byes as 0, so all players play in that round.

So, we're keeping it simple - if we have a 19 players, 13 receive a buy in and 6 play in the first round. So it returns those players as a double array:

    [[14, 19], [15, 18], [16, 17]]

We can then use these, add them to the first round, and then wait for the winners - once the winners have been announced we'll add them to the remaining players:

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 18, 17]

This leaves us with a perfect power of two, so we can just repeat the process, leaving us with our next round:

    [[1, 17], [2, 18], [3, 14], ... [8, 9]]

These are our matches, and they are returned to the server (and we need to handle how to use them there!)
*/

// const createRound = (teams) => {
//     const n = teams.length;
//     if (n < 2) return null;
//     const byes = createByes(n);
//     if (byes > 0) {
//         const firstRoundPlayers = generateFirstRoundPlayers(byes, teams);
//         const roundMatches = generateRoundMatches(firstRoundPlayers);
//         return roundMatches;
//     }
//     const roundMatches = generateRoundMatches(teams);
//     return roundMatches;
// } 

// const generateRoundMatches = (roundPlayers) => {
//     const matches = [];
//     for (let i = 0; i < roundPlayers.length / 2; i++) {
//         const player1 = roundPlayers[i];
//         const player2 = roundPlayers[roundPlayers.length - 1 - i];
//         matches.push([player1, player2]);
//     }
//     return matches;
// }

const Match = require("../../models/match");
const Team = require("../../models/team");

const createByes = (n) => {
    const nextPowerOfTwo = getNextPowerOfTwo(n);
    const byes = nextPowerOfTwo - n;
    return byes;
} 

const getNextPowerOfTwo = (n) => {
    let power = 1;
    while (power < n) {
        power *= 2;
    }
    return power;
} 

const generateFirstRoundPlayers = (byes, teams) => {
    const firstRoundPlayers = [];
    for (let i = byes; i < teams.length; i++) {
        firstRoundPlayers.push(teams[i]);
    }
    return firstRoundPlayers;
}

const createMatch = async(category, tournamentRoundText, participants, nextMatchId = null) => {
    const match = new Match({
        category,
        tournamentRoundText,
        state: "SCHEDULED", // This is the default value since all matches are new and NOT played
        participants: participants.map(participant => ({
            player: participant.playerId || null,
            team: participant.teamId || null,
            isWinner: false,
            name: participant.name
        })),
        nextMatchId
    });
    return match.save();
}

const generateMatchesForTournament = async (category, teams) => {
    // We are determining the perfect power of two with Math.log2() - so if we were to have 128 teams, we would have 7 here
    // because 2^(7) is 128. We need to ceil it because one over that number (129) would result in 8 rounds because we'd have 127 buy ins
    // and one first round match 
    const totalRounds = Math.ceil(Math.log2(teams.length));
    console.log(totalRounds);
    const matchesByRound = [];

    // First, we create our final match - this is important as we need the _id of this to be the pointers for the preceding round.
    const finalMatch = await createMatch(category, totalRounds, []);
    matchesByRound.push(finalMatch);
    // console.log(matchesByRound);

    // Next, we need to generate the rounds for the reminaing rounds, working backwards
    for (let round = 1; round <= totalRounds; round++) {
        const currentRoundMatches = [];
        // We're working backwards here - so the first index would be 0 - i.e. the final match
        const nextRoundMatches = matchesByRound[round - 1]._id;
        console.log(nextRoundMatches);
        for (let i = 0; i < Math.pow(2, totalRounds - round); i++) {
            const nextMatchId = nextRoundMatches[Math.floor(i / 2)]._id;
            const match = await createMatch(category, totalRounds - round, [], nextMatchId);
            currentRoundMatches.push(match);
        }
        // Push each element of currentRoundMatches in order to matchesByRound
        matchesByRound.push(...currentRoundMatches);
    }

    const firstRoundMatches = matchesByRound[totalRounds];
    const byes = createByes(teams.length);
    const firstRoundPlayers = generateFirstRoundPlayers(byes, teams);

    for (let i = 0; i < firstRoundMatches.length; i++) {
        const match = firstRoundMatches[i];
        if (i < byes) {
            match.participants.push({ playerId: null, teamId: firstRoundPlayers[i]._id, name: firstRoundPlayers[i].name });
        } else {
            match.participants.push(
                { playerId: firstRoundPlayers[i * 2 - byes]._id, teamId: null, name: firstRoundPlayers[i * 2 - byes].name },
                { playerId: firstRoundPlayers[i * 2 + 1 - byes]._id, teamId: null, name: firstRoundPlayers[i * 2 + 1 - byes].name }
            );
        }
        await match.save();
    }
}

module.exports = generateMatchesForTournament;