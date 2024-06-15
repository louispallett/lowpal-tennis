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

const createRound = (teams) => {
    const n = teams.length;
    if (n < 2) return null;
    const byes = createByes(n);
    if (byes > 0) {
        const firstRoundPlayers = generateFirstRoundPlayers(byes, teams);
        const roundMatches = generateRoundMatches(firstRoundPlayers);
        return roundMatches;
    }
    const roundMatches = generateRoundMatches(teams);
    return roundMatches;
} 

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

const generateRoundMatches = (roundPlayers) => {
    const matches = [];
    for (let i = 0; i < roundPlayers.length / 2; i++) {
        const player1 = roundPlayers[i];
        const player2 = roundPlayers[roundPlayers.length - 1 - i];
        matches.push([player1, player2]);
    }
    return matches;
}

module.exports = createRound;