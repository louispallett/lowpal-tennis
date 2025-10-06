import { MatchTypeLite } from "@/lib/types";

type QualifyingMatchesProps = {
    matches:MatchTypeLite[],
    allMatches:MatchTypeLite[] | null
}

export default function QualifyingMatches({ matches, allMatches }:QualifyingMatchesProps) {
    return (
        <div className="standard-container bg-indigo-500">
            <h3 className="home-subtitle text-4xl! text-slate-100 mb-5">Qualifying Matches</h3>
            <div className="table">
                <div className="row">
                    <div className="cell bg-lime-300! text-center">Players</div>
                    <div className="cell bg-lime-300! text-center">Next Match</div>
                </div>
                { matches.map(match => (
                    <QualMatchCard matchData={match} allMatches={allMatches} qualMatches={matches} key={match._id} />
                ))}
            </div>
        </div>
    )
}

type QualMatchCardProps = {
    matchData:MatchTypeLite,
    allMatches:MatchTypeLite[] | null,
    qualMatches:MatchTypeLite[] | null,
}

function QualMatchCard({ matchData, allMatches, qualMatches }:QualMatchCardProps) {
    const nextMatch = allMatches?.find(item => item._id == matchData.nextMatchId);
    let nextMatchPlayers = [];
    if (nextMatch.previousMatchId.length > 1) {
        for (const id of nextMatch.previousMatchId) {
            if (id != matchData._id) {
                const match = qualMatches?.find(item => item._id == id);
                for (const player of match?.participants) {
                    nextMatchPlayers.push(player.name);
                }
            }
        }
    } else {
        nextMatchPlayers.push(nextMatch?.participants[0].name);
    }
    return (
        <>
            <div className="row">
                <p className="cell">{matchData.participants[0].name} vs. {matchData.participants[1].name}</p>
                { nextMatchPlayers.length > 1 ? (
                    <>
                        <p className="cell">
                            vs. {nextMatchPlayers[0]} - or - {nextMatchPlayers[1]}
                        </p>
                    </>
                ) : (
                    <p className="cell">vs. {nextMatchPlayers[0]}</p>
                )}
            </div>
        </>
    )
}