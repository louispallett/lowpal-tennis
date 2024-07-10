/* 
=====================================
Creating Tournaments
=====================================

This file, via the generateMatchesForTournament function, takes a teams array (assumed to be in order of skill) and produces a multidimensional array of match objects by round, with their participants included.
*/

const mongoose = require("mongoose");

const calculateByes = (n) => {
    const nextPowerOfTwo = getNextPowerOfTwo(n);
    const result = nextPowerOfTwo - n;
    return result;
}

const getNextPowerOfTwo = (n) => {
    let power = 1;
    while (power < n) {
        power *=2;
    }
    return power;
}

const createMatch = (category, tournamentRoundText, nextMatchId = null) => {
    const match = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        category,
        tournamentRoundText,
        state: "SCHEDULED", // This is the default value since all matches are new and NOT played
        participants: [],
        nextMatchId,
    };
    return match;
}

const generateMatchesForTournament = (category, teams) => {
    
    const numOfPlayers = teams.length;
    const totalRounds = Math.ceil(Math.log2(numOfPlayers));
    const matchesByRound = [];
    const numOfQualPlayers = numOfPlayers - calculateByes(numOfPlayers);    
   
    const finalMatch = createMatch(category, totalRounds);
    matchesByRound.push([finalMatch]);    

    let round = 1;
   
    // Loop condition based on byes - we want it to run it to the end if Math.log2(numOfPlayers) is an int, but only to the penultimate round if
    // it is a float (and then we add qualifying rounds after)
    while (round < (numOfQualPlayers == numOfPlayers ? totalRounds : totalRounds - 1)) {
        const currentRoundMatches = [];
        for (let i = 0; i < matchesByRound.at(-1).length * 2; i++) {
            const nextMatchId = matchesByRound[round - 1][Math.floor(i / 2)]._id;
            const match = createMatch(category, totalRounds - round, nextMatchId);
            currentRoundMatches.push(match);
        }
        matchesByRound.push(currentRoundMatches);
        round++;
    }
    
    if (numOfQualPlayers != numOfPlayers) { 
        const currentRoundMatches = [];
        let i = 0;
        while (currentRoundMatches.length < numOfQualPlayers / 2) {
            const nextRoundMatches = matchesByRound.at(-1);
            /* This conditional allows us to work from the middle of the array outwards, starting with index 2 (mid + 1). If i, 
            is even, it works on the right side of the array. If i is odd, it works on the left. nextRoundMatches must always be 
            a 2^(x), so it's length is always even. 
            We use Math.floor and Math.ceil here to control the index for the next round _id - this is because on the third or fourth iteration,
            when i = 2 || 3, we don't want to skip over a value.
            However, we also want to ensure that we reset i if the */
            let nextMatch;
            if (i % 2 == 0) { // i is even
                nextMatch = nextRoundMatches[(nextRoundMatches.length / 2) + Math.floor(i / 2)];
            } else { // i is odd
                nextMatch = nextRoundMatches[(nextRoundMatches.length / 2) - Math.ceil(i / 2)];
            }
            const match = createMatch(category, 1, nextMatch._id);

            /* Assign the returned _id to the nextMatchId.previousMatchId (backwards pointer). We are using the nullish operator here (??=) - but there are two operations happening here - the nullish operator and the push method.
            The nullish operator checks if the condition to the left of the operator (??=) is null. If it is, it creates it and assigns it the value to the right of the operator. If it isn't null, then it just returns the element, so ]
            "(nextMatch.previousMatchId ??= [])" just becomes "nextMatch.previousId".
            Then, match._id is pushed to the previousMatchId element (which WAS either null and is now [] or was not null and contained a value)*/
            (nextMatch.previousMatchId ??= []).push(match._id);
            
            currentRoundMatches.push(match)
            i++;
            if (i == nextRoundMatches.length) i = 0;
        }
        matchesByRound.push(currentRoundMatches);
    }

    let result;

    let _teams; // We will use this also to add our round 1 matches
    if (numOfQualPlayers != numOfPlayers) {
        const qualMatches = matchesByRound.at(-1);
        const round1Matches = matchesByRound.at(-2);
        let index = round1Matches.length;
        // Condition - if the number of qualifying matches > round 1 matches - i.e. some round 1 matches have double qualifying matches
        if (qualMatches.length > round1Matches.length) index = round1Matches.length - (qualMatches.length - round1Matches.length);
        let i = 0;
        _teams = [...teams]; // As arrays are not primitive values, they copy the memory address when passed as a value to a variable, hence we use the spread operator to copy the values over (not the memory!) - this was covered in CS50 with C.
        // We start our index in the array somewhere, we then 
        while (_teams.length > (teams.length - numOfQualPlayers)) {
            if (_teams.length === 0) throw new Error("Memory error: Teams assignment returned 0.");
            const qualPlayers = _teams.splice(index, 1)[0];
            // console.log(qualPlayers);
            qualMatches[i].participants.push({
                id: qualPlayers._id.toString(),
                name: qualPlayers.firstName ? `${qualPlayers.firstName[0]}. ${qualPlayers.lastName}` : `${qualPlayers.players[0].firstName[0]}. ${qualPlayers.players[0].lastName} and ${qualPlayers.players[1].firstName[0]}. ${qualPlayers.players[1].lastName}`,
                ranking: qualPlayers.ranking,
                seeded: qualPlayers.seeded,
                resultText: null,
                isWinner: false,
                status: null,
            });
            // We use the spread operator here to deconstruct it.
            // qualMatches[i].participants.push(..._teams.splice(index, 1));
            i++;
            // Loop back around for second players
            if (i > qualMatches.length - 1) i = 0;
        }
    } else {
        // In this instance we are dealing with a perfect 2^x tournament
        const firstRoundMatches = matchesByRound.splice(matchesByRound.length - 1, 1)[0];
        _teams = [...teams];
        const leftRound1Matches = firstRoundMatches.splice(0, firstRoundMatches.length / 2);
        const rightRound1Matches = firstRoundMatches.splice(0);

        let leftIndex = 0;
        for (let i = 0; i < _teams.length; i+=2) {
            while ((leftIndex % 2 == 0 && leftRound1Matches[Math.floor(leftIndex / 2)].previousMatchId) || (leftIndex % 2 != 0 && leftRound1Matches[leftRound1Matches.length - Math.ceil(leftIndex / 2)].previousMatchId)) {
                if (Math.floor(leftIndex / 2) > leftRound1Matches.length - 1 || leftRound1Matches.length - Math.ceil(leftIndex / 2) < 0) break;
                if ((leftIndex % 2 == 0 && leftRound1Matches[Math.floor(leftIndex / 2)].participants > 1) || (leftIndex % 2 != 0 && leftRound1Matches[leftRound1Matches.length - Math.ceil(leftIndex / 2)].participants > 1)) {
                    leftIndex++;
                } else {
                    break;
                }
            }
            if (leftIndex % 2 == 0) {
                leftRound1Matches[Math.floor(leftIndex / 2)].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            } else {
                leftRound1Matches[leftRound1Matches.length - Math.ceil(leftIndex / 2)].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            }
            leftIndex++;
        }
        let rightIndex = 0;
        for (let i = 1; i < _teams.length; i+=2) {
            while ((rightIndex % 2 == 0 && rightRound1Matches[rightRound1Matches.length - Math.ceil(rightIndex / 2) - 1].previousMatchId) || (rightIndex % 2 != 0 && rightRound1Matches[Math.floor(rightIndex / 2)].previousMatchId)) {
                if (Math.floor(rightIndex / 2) > rightRound1Matches.length - 1 || rightRound1Matches.length - Math.ceil(rightIndex / 2) < 0) break;
                if ((rightIndex % 2 == 0 && rightRound1Matches[rightRound1Matches.length - Math.ceil(rightIndex / 2) - 1].participants > 1) || (rightIndex % 2 != 0 && rightRound1Matches[Math.floor(rightIndex / 2)].participants > 1)) {
                    rightIndex++;
                } else {
                    break;
                }
            }
            if (rightIndex % 2 == 0) {
                rightRound1Matches[rightRound1Matches.length - Math.ceil(rightIndex / 2) - 1].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            } else {
                rightRound1Matches[Math.floor(rightIndex / 2)].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            }
            rightIndex++;
        }
        result = [...leftRound1Matches, ...rightRound1Matches];
        matchesByRound.splice(matchesByRound.length, 0, result);
        return matchesByRound; 
    }

    const doublesLimit = (getNextPowerOfTwo(teams.length) / 2) + ((getNextPowerOfTwo(teams.length) / 2) / 2);
    const round1Matches = matchesByRound.splice(matchesByRound.length - 2, 1)[0];
    
    // Condition - if teams.length > doublesLimit, this means we have doubles matches, so we can simply loop from inside out
    if (teams.length > doublesLimit) {
        let index = 0;
        for (let i = 0; i < _teams.length; i++) {
            if (index % 2 == 0) {
                round1Matches[Math.floor(index / 2)].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            } else {
                round1Matches[round1Matches.length - Math.ceil(index / 2)].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            }
            index++;
        }
        matchesByRound.splice(matchesByRound.length - 1, 0, round1Matches);
        return matchesByRound;
    } else {
        const leftRound1Matches = round1Matches.splice(0, round1Matches.length / 2);
        const rightRound1Matches = round1Matches.splice(0);

        let leftIndex = 0;
        for (let i = 0; i < _teams.length; i+=2) {
            while ((leftIndex % 2 == 0 && leftRound1Matches[Math.floor(leftIndex / 2)].previousMatchId) || (leftIndex % 2 != 0 && leftRound1Matches[leftRound1Matches.length - Math.ceil(leftIndex / 2)].previousMatchId)) {
                if (Math.floor(leftIndex / 2) > leftRound1Matches.length - 1 || leftRound1Matches.length - Math.ceil(leftIndex / 2) < 0) break;
                if ((leftIndex % 2 == 0 && leftRound1Matches[Math.floor(leftIndex / 2)].participants > 1) || (leftIndex % 2 != 0 && leftRound1Matches[leftRound1Matches.length - Math.ceil(leftIndex / 2)].participants > 1)) {
                    leftIndex++;
                } else {
                    break;
                }
            }

            if (leftIndex % 2 == 0) {
                leftRound1Matches[Math.floor(leftIndex / 2)].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            } else {
                leftRound1Matches[leftRound1Matches.length - Math.ceil(leftIndex / 2)].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            }
            leftIndex++;
        }
        let rightIndex = 0;
        for (let i = 1; i < _teams.length; i+=2) {
            while ((rightIndex % 2 == 0 && rightRound1Matches[rightRound1Matches.length - Math.ceil(rightIndex / 2) - 1].previousMatchId) || (rightIndex % 2 != 0 && rightRound1Matches[Math.floor(rightIndex / 2)].previousMatchId)) {
                if (Math.floor(rightIndex / 2) > rightRound1Matches.length - 1 || rightRound1Matches.length - Math.ceil(rightIndex / 2) < 0) break;
                if ((rightIndex % 2 == 0 && rightRound1Matches[rightRound1Matches.length - Math.ceil(rightIndex / 2) - 1].participants > 1) || (rightIndex % 2 != 0 && rightRound1Matches[Math.floor(rightIndex / 2)].participants > 1)) {
                    rightIndex++;
                } else {
                    break;
                }
            }
            if (rightIndex % 2 == 0) {
                rightRound1Matches[rightRound1Matches.length - Math.ceil(rightIndex / 2) - 1].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            } else {
                rightRound1Matches[Math.floor(rightIndex / 2)].participants.push({
                    id: _teams[i]._id.toString(),
                    name: _teams[i].firstName ? `${_teams[i].firstName[0]}. ${_teams[i].lastName}` : `${_teams[i].players[0].firstName[0]}. ${_teams[i].players[0].lastName} and ${_teams[i].players[1].firstName[0]}. ${_teams[i].players[1].lastName}`,
                    ranking: _teams[i].ranking,
                    seeded: _teams[i].seeded,
                    resultText: null,
                    isWinner: false,
                    status: null,
                });
            }
            rightIndex++;
        }
        result = [...leftRound1Matches, ...rightRound1Matches];
        matchesByRound.splice(matchesByRound.length - 1, 0, result);
        return matchesByRound; 
    }
}

module.exports = generateMatchesForTournament