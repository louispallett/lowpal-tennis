import Bracket from "@/app/dashboard/[tournamentId]/Bracket";
import { generateMatches } from "@/lib/generateMatches";

export default function GenerateMatches() {
    return (
        <div className="flex-1 mx-auto px-1 sm:px-4">
            <div className="standard-container bg-slate-200/75">
                <h3 className="home-subtitle">Quick Generate Matches</h3>
            </div>
            <About />
            <CreateYourOwn />
        </div>
    )
}

function About() {

    const createPlayers = (n:number):string[] => {
        const result:string[] = [];
        for (let i = 1; i <= n; i++) {
            result.push("Player " + i.toString());
        }
        return result;
    }

    const players = createPlayers(16);
    const matches = generateMatches(players);

    for (let match of matches) {
        match.category = { name: "" };
        match.id = match._id;
        match.state = "SCHEDULED";
        match.participants = match.participants.map((participant) => {
            const newParticipant = {
                name: participant,
                resultText: ""
            };
            
            return newParticipant;
        });
    }

    const matchesClient = JSON.parse(JSON.stringify(matches));

    return (
        <div className="standard-container bg-slate-200/75 my-2.5">
            <h3 className="home-subtitle text-4xl!">How it works</h3>
            <p>
                One of the key parts of this project is the seeding algorithm. This allows a host to enter the names and rankings of players 
                and return a tournament bracket, whereby the highest ranking players are placed in the tournament so that they do not meet
                each other until later.
            </p>
            <p>
                So, in the case where a tournament has sixteen players:
            </p>
            <ul>
                <li>Players 1 & 2 cannot meet each other until the final.</li>
                <li>Players 1 - 4 cannot meet each other until the semi-finals.</li>
                <li>Players 1 - 8 cannot meet each other until the quarter-finals.</li>
                <li>... and so on.</li>
            </ul>
            <p>
                If we 'name' the players after their ranking, we get a tournament like this:
            </p>
            <Bracket matchData={matchesClient} categoryName="" />
            <p>
                Tournament brackets are made from powers of 2 (2, 4, 8, 16, 32, 64, etc.), because they can be halved into integers until they 
                reach 1 (i.e., our final). So, if the number of players is <i>not</i> a power of 2, there will be qualifying matches. The lowest 
                ranked players are placed in these qualifying matches. 
            </p>
            <p>
                Qualifying matches are just that - they are matches for players to <i>qualify</i> into the tournament, so they are not displayed 
                on the bracket.
            </p>
        </div>
    )
}

function CreateYourOwn() {
    return (
        <div className="standard-container bg-slate-200/75 my-2.5">
            <h3 className="home-subtitle text-4xl!">Create Your Own</h3>
            <p>
                You can quickly create your own bracket below using the function below - you just need to enter their names and rankings below:
            </p>
        </div>
    )
}