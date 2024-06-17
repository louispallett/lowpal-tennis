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

const Category = require("../../models/category");
const Team = require("../../models/team");

const createTeams = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId).populate({ path: "players", select: "seeded" }).exec();
        if (!category) throw new Error("Category not found");

        const seeded = category.players.filter(player => player.seeded);
        const notSeeded = category.players.filter(player => !player.seeded);

        const teams = matchDoublesPairs(seeded, notSeeded);
        
        for (let i = 0; i < teams.length; i++) {
            const new_team = new Team({
                players: [teams[i][0], teams[i][1]],
                category: categoryId
            });
            await new_team.save();
        }

        const newTeams = Team.find({ category: categoryId });
        return newTeams;

    } catch (err) {
        console.error("Error creating teams: ", err);
        throw err;
    }
}

// This function assumes seeded.length < notSeeded.length
const matchDoublesPairs = (seeded, notSeeded) => {

    // I.e. total number of players is not even
    if ((seeded.length + notSeeded.length) % 2 != 0) {
        return new Error("Number of players must be even");
    }

    // Note that seeded and notSeeded must be arrays
    seeded = seeded.sort(() => Math.random() - 0.5);
    notSeeded = notSeeded.sort(() => Math.random() - 0.5);
    let teams = [];

    while(seeded.length > 0 && notSeeded.length > 0) {
        const playerA = seeded.shift();
        const playerB = notSeeded.shift();
        teams.push([playerA, playerB])
    }

    // Remaining nonSeeded matched
    while(notSeeded.length > 1) {
        const playerA = notSeeded.shift();
        const playerB = notSeeded.shift();
        teams.push([playerA, playerB])
    }

    return teams;
}

module.exports = createTeams;