const createRound = require("../../public/scripts/createTournament");

const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

describe("Test createRound()", () => {
    test("Should return the correct length of players for the first round", () => {
        expect(createRound(teams).length).toEqual(3);
    });

    test("Should return the correct players for the first round", () => {
        expect(createRound(teams)).toStrictEqual([[14, 19], [15, 18], [16, 17]]);
    });

    test("Works with perfect powers of two", () => {
        const teams2 = [1, 2, 3, 4, 5, 6, 7, 8];
        expect(createRound(teams2).length).toEqual(4)
        expect(createRound(teams2)).toStrictEqual([[1, 8], [2, 7], [3, 6], [4, 5]]);
    });
});