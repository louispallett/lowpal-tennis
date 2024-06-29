const generateMatchesForTournament = require("../../public/scripts/createTournamentReplace");

/* 
    What do we need to test here?

    1. Correct number of byes returned.
    2. Correct number of matches (players - 1) - this is always the case!
    3. Correct length of matchesByRound array
    4. Correct length of each array in matchesByRound
    5. Spot check nextMatchId to correctly match _id of next match - check two or three of these!

*/

describe("Works with a 2^(2) case with single qualifying matches (between 9 to 12 (inclusive))", () => {
    const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const category = "00ahed98shaj4e8ka03k" // Just a random test Id
    const result = generateMatchesForTournament(category, teams);

    describe("Match tests", () => {
        test("Number of qualifying matches is correct", () => {
            expect(result.at(-1)).toHaveLength(4);
        });
        test.skip("Number of MATCHES is correct", () => {
            expect(result.flat()).toHaveLength(teams.length - 1);
        });
        test.skip("Number of ROUNDS is correct", () => {
            expect(result).toHaveLength(4);
        });
        test.skip("Each round has the correct number of matches", () => {
            expect(result[0]).toHaveLength(1);
            expect(result[1]).toHaveLength(2);
            expect(result[2]).toHaveLength(4);
            expect(result[3]).toHaveLength(4);
        });
        test.skip("Matches have correct nextMatchIds (spot checks)", () => {
            expect(result[1][0].nextMatchId).toBe(result[0][0]._id); // SF to final
            expect(result[2][3].nextMatchId).toBe(result[1][1]._id); // QF to SF            
            expect(result[3][0].nextMatchId).toBe(result[2][2]._id);
            expect(result[3][3].nextMatchId).toBe(result[2][0]._id);
        });
    });

    describe.skip("Participant tests", () => {
        test("Length of participants is correct for qualifying matches", () => {
            for (let i = 0; i < result.at(-1).length; i++) {
                expect(result.at(-1)[i].participants).toHaveLength(2);
            }
        });
        test("Length of participants is correct for round 1 matches", () => {
            for (let i = 0; i < result.at(-1).length; i++) {
                expect(result.at(-2)[i].participants).toHaveLength(1);
            }
        });
        test("Participants for qualifying matches are correct (spot checks)", () => {
            expect(result.at(-1)[0].participants).toContain(5);
            expect(result.at(-1)[0].participants).toContain(9);
            expect(result.at(-1)[3].participants).toContain(8);
            expect(result.at(-1)[3].participants).toContain(12);
            expect(result.at(-1)[1].participants).toContain(10);
        });
        test("Participants for round matches are correct", () => {
            expect(result.at(-2)[0].participants).toContain(1);
            expect(result.at(-2)[3].participants).toContain(2);
            expect(result.at(-2)[2].participants).toContain(4);
        });
    })
});

describe.skip("Works with a 2^(2) case with double qualifying matches (between 13 and 15 (inclusive))", () => {
    const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const category = "00apoahgnq9amofpLo" // Just a random test Id
    const result = generateMatchesForTournament(category, teams);

    describe("Match tests", () => {
        test("Number of qualifying matches is correct", () => {
            expect(result.at(-1)).toHaveLength(6);
        });
        test("Number of MATCHES is correct", () => {
            expect(result.flat()).toHaveLength(teams.length - 1);
        });
        test("Number of ROUNDS is correct", () => {
            expect(result).toHaveLength(4);
        });
        test("Each round has the correct number of matches", () => {
            expect(result[0]).toHaveLength(1);
            expect(result[1]).toHaveLength(2);
            expect(result[2]).toHaveLength(4);
            expect(result[3]).toHaveLength(6);
        });
        test("Matches have correct nextMatchIds (spot checks)", () => {
            expect(result[3][0].nextMatchId).toBe(result[2][2]._id);
            expect(result[3][3].nextMatchId).toBe(result[2][0]._id);
            expect(result[3][4].nextMatchId).toBe(result[2][2]._id);
        });
    });

    describe("Participant tests", () => {
        test("Length of participants is correct for qualifying matches", () => {
            for (let i = 0; i < result.at(-1).length; i++) {
                expect(result.at(-1)[i].participants).toHaveLength(2);
            }
        });
        test("Length of participants is correct for round 1 matches (spot checks)", () => {
            expect(result.at(-2)[0].participants).toHaveLength(1);
            expect(result.at(-2)[2].participants).toHaveLength(0);
            expect(result.at(-2)[3].participants).toHaveLength(1);
        });
        test("Participants for qualifying matches are correct (spot checks)", () => {
            expect(result.at(-1)[0].participants).toContain(3);
            expect(result.at(-1)[0].participants).toContain(9);
            expect(result.at(-1)[3].participants).toContain(6);
            expect(result.at(-1)[4].participants).toContain(13);
            expect(result.at(-1)[1].participants).toContain(4);
        });
        test("Participants for round matches are correct", () => {
            expect(result.at(-2)[0].participants).toContain(1);
            expect(result.at(-2)[3].participants).toContain(2);
        });
    });
});

describe.skip("Works with a 2^(3) case with single qualifying matches (between 17 to 24 (inclusive))", () => {
    const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const category = "00qaho3qthiapu93ajas" // Just a random test Id
    const result = generateMatchesForTournament(category, teams);

    describe("Match tests", () => {
        test("Number of qualifying matches is correct", () => {
            expect(result.at(-1)).toHaveLength(3);
        });
        test("Number of MATCHES is correct", () => {
            expect(result.flat()).toHaveLength(teams.length - 1);
        });
        test("Number of ROUNDS is correct", () => {
            expect(result).toHaveLength(5);
        });
        test("Each round has the correct number of matches", () => {
            expect(result[0]).toHaveLength(1);
            expect(result[1]).toHaveLength(2);
            expect(result[2]).toHaveLength(4);
            expect(result[3]).toHaveLength(8);
            expect(result[4]).toHaveLength(3);
        });
        test("Matches have correct nextMatchIds (spot checks)", () => {
            expect(result[4][0].nextMatchId).toBe(result[2][2]._id);
            expect(result[4][3].nextMatchId).toBe(result[2][0]._id);
        });
    });

    describe("Participants tests", () => {
        test("Length of participants is correct for qualifying matches", () => {
            for (let i = 0; i < result.at(-1).length; i++) {
                expect(result.at(-1)[i].participants).toHaveLength(2);
            }
        });
        test("Length of participants is correct for round 1 matches (spot checks)", () => {
            expect(result.at(-2)[0].participants).toHaveLength(2);
            expect(result.at(-2)[4].participants).toHaveLength(1);
            expect(result.at(-2)[3].participants).toHaveLength(1);
            expect(result.at(-2)[7].participants).toHaveLength(2);
        });
        test("Participants for qualifying matches are correct (spot checks)", () => {
            expect(result.at(-1)[0].participants).toContain(3);
            expect(result.at(-1)[0].participants).toContain(9);
            expect(result.at(-1)[3].participants).toContain(6);
            expect(result.at(-1)[4].participants).toContain(13);
            expect(result.at(-1)[1].participants).toContain(4);
        });
        test("Participants for round matches are correct", () => {
            expect(result.at(-2)[0].participants).toContain(1);
            expect(result.at(-2)[0].participants).toContain(15);
            expect(result.at(-2)[7].participants).toContain(2);
            expect(result.at(-2)[7].participants).toContain(16);
            expect(result.at(-2)[3].participants).toContain(3);
            expect(result.at(-2)[4].participants).toContain(4);
        });
    });
});

describe.skip("Works with a 2^(3) case with double qualifying matches (between 25 to 31 (inclusive))", () => {
    const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    const category = "00aegfealoih3ql89oyr3p9q" // Just a random test Id
    const result = generateMatchesForTournament(category, teams);

    describe("Match tests", () => {
        test("Number of qualifying matches is correct", () => {
            expect(result.at(-1)).toHaveLength(6);
        });
        test("Number of MATCHES is correct", () => {
            expect(result.flat()).toHaveLength(teams.length - 1);
        });
        test("Number of ROUNDS is correct", () => {
            expect(result).toHaveLength(5);
        });
        test("Each round has the correct number of matches", () => {
            expect(result[0]).toHaveLength(1);
            expect(result[1]).toHaveLength(2);
            expect(result[2]).toHaveLength(4);
            expect(result[3]).toHaveLength(8);
            expect(result[4]).toHaveLength(9);
        });
        test("Matches have correct nextMatchIds (spot checks)", () => {
            expect(result[4][0].nextMatchId).toBe(result[3][4]._id);
            expect(result[4][8].nextMatchId).toBe(result[3][4]._id);
            expect(result[4][2].nextMatchId).toBe(result[3][5]._id);
            expect(result[4][7].nextMatchId).toBe(result[3][0]._id);
        });
    });

    describe("Participant tests", () => {
        test("Length of participants is correct for qualifying matches", () => {
            for (let i = 0; i < result.at(-1).length; i++) {
                expect(result.at(-1)[i].participants).toHaveLength(2);
            }
        });
        test("Length of participants is correct for round 1 matches (spot checks)", () => {
            expect(result.at(-2)[0].participants).toHaveLength(1);
            expect(result.at(-2)[4].participants).toHaveLength(0);
            expect(result.at(-2)[7].participants).toHaveLength(1);
        });
        test("Participants for qualifying matches are correct (spot check)", () => {
            expect(result.at(-1)[0].participants).toContain(8);
            expect(result.at(-1)[8].participants).toContain(25);
            expect(result.at(-1)[3].participants).toContain(10);
            expect(result.at(-1)[7].participants).toContain(15);
            expect(result.at(-1)[3].participants).toContain(20);
        });
        test("Participants for round matches are correct", () => {
            expect(result.at(-2)[0].participants).toContain(1);
            expect(result.at(-2)[7].participants).toContain(2);
        });
    })
});
