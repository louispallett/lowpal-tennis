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


Note that we should be able to add participants as an array for doubles categories - like so:
    "participants": [
        # First team
        [{
            "id": "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc", // Unique identifier of any kind
            "resultText": "WON", // Any string works
            "isWinner": false,
            "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
            "name": "giacomo123"
        },
        {
            "id": "9ea9ce1a-4794-4553-856c-9a3620c0531b",
            "resultText": null,
            "isWinner": true,
            "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
            "name": "Ant"
        }],
        # Second team
        [{
            "id": "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc", // Unique identifier of any kind
            "resultText": "WON", // Any string works
            "isWinner": false,
            "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
            "name": "giacomo123"
        },
        {
            "id": "9ea9ce1a-4794-4553-856c-9a3620c0531b",
            "resultText": null,
            "isWinner": true,
            "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
            "name": "Ant"
        }]
    ]

So, instead of 
*/