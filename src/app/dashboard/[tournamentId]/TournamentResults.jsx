"use client"

import Bracket from "./Bracket.jsx";
import NoInfo from "./NoInfo.tsx";

export default function TournamentResults({ matches, stage }) {
    const matchesExist = matches.length > 0;
    let groupedMatches = [];

    if (matchesExist) {
        const validMatches = matches.filter(match => !match.qualifyingMatch);
        const groupedMatchesObj = validMatches.reduce((acc, match) => {
            const category = match.category.name;
            
            if (!acc[category]) {
                acc[category] = [];
            }
            
            acc[category].push(match);
            return acc;
        }, {});
        groupedMatches = Object.values(groupedMatchesObj);
    }

    return (
        <div className="standard-container container-indigo flex flex-col gap-2.5 z-0">
            <h3>Tournament Results</h3>
            <div className="flex flex-col items-center gap-2.5">
                { (stage === "play" || stage === "finished") ? (
                    <>
                        { matchesExist ? (
                            <>
                                { groupedMatches.map(item => (
                                    <Bracket matchData={item} categoryName={item[0].category.name} key={item[0].category.name} />
                                ))}
                            </>
                        ) : (
                            <div className="flex flex-col justify-center items-center gap-8">
                                <div className="racket-cross-wrapper">
                                    <img src="/assets/images/racket-red.svg" alt="" />
                                    <img src="/assets/images/racket-blue.svg" alt="" />
                                </div>
                                <p>Matches for this tournament haven't been created yet!</p>
                            </div>
                        )}
                    </>
                ) : (
                    <NoInfo text="Matches for this tournament haven't been created yet!" />
                )}
            </div>
        </div>
    )
}