"use client"

import Bracket from "@/app/dashboard/[tournamentId]/Bracket";
import { MatchTypeLite } from "@/lib/types";
import axios from "axios";
import { useState } from "react"
import QualifyingMatches from "./QualifyingMatches";

export function GenerateMatchesForm() {
    const [matches, setMatches] = useState<MatchTypeLite[] | null>(null);
    const [qualMatches, setQualMatches] = useState<MatchTypeLite[] | null>(null);
    const [error, setError] = useState<string>(null);
    const [isPending, setIsPending] = useState(false);

    const [players, setPlayers] = useState([{ name: "", rank: "" }]);

const handleChange = (index: number, field: string, value: string | number) => {
    const newPlayers = [...players];
    if (field === 'rank') {
        newPlayers[index][field] = value === '' ? '' : Number(value);
    } else {
        newPlayers[index][field] = value;
    }
    setPlayers(newPlayers);
};


    const addPlayer = () => {
        setPlayers([...players, { name: '', rank: '' }]);
    };

    const removePlayer = (index:number) => {
        if (players.length === 1) return;
        const newPlayers = players.filter((_, i) => i !== index);
        setPlayers(newPlayers);
    };

    const submit = async () => {
        setIsPending(true);
        if(players.length > 1024) {
            setError("Number of players cannot be greater than 1024");
            setIsPending(false);
            return;
        }
        axios.post("/api/match/client-generate", { players })
            .then((response:any) => {
                const returnedMatches = response.data.matches;
                const matchesClient = returnedMatches.map((match: any, matchIdx: number) => ({
                    _id: match._id,
                    id: match._id,
                    category: { name: "" },
                    nextMatchId: match.nextMatchId,
                    qualifyingMatch: match.qualifyingMatch,
                    tournamentRoundText: match.tournamentRoundText,
                    state: "SCHEDULED",
                        participants: match.participants.map((participant:any, idx:number) => ({
                            name: typeof participant === "string" ? participant : participant.name,
                            resultText: "",
                        })),
                    previousMatchId: match.previousMatchId || []
                }));

                const matchesClientFiltered = matchesClient.filter((match:MatchTypeLite) => !match.qualifyingMatch);
                setMatches(matchesClientFiltered);
                const matchesClientQual = matchesClient.filter((match:MatchTypeLite) => match.qualifyingMatch);
                setQualMatches(matchesClientQual);
            }).catch((err:any) => {
                console.error(err);
                setError(err.response.data.message);
            }).finally(() => {
                setIsPending(false);
            })
    }

    return (
        <>
            <div className="standard-container p-2.5 flex flex-col gap-2.5">
                {players.map((player, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2.5">
                        <input
                            type="text"
                            placeholder="Name"
                            value={player.name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                            className="form-input flex-1 shadow-none!"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Rank"
                            value={player.rank}
                            onChange={(e) => handleChange(index, 'rank', e.target.value)}
                            className="form-input max-w-36 shadow-none!"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removePlayer(index)}
                            className="danger max-w-48 shadow-none!"
                        >
                            - Remove
                        </button>
                    </div>
                ))}
                <div className="flex justify-end">
                        <button
                        type="button"
                        onClick={addPlayer}
                        className="success max-w-48 shadow-none!"
                    >
                        + Add
                    </button>
                </div>
                { isPending ? (
                    <div className="flex justify-center items-center standard-container bg-indigo-600">
                        <div className="spinner h-6 w-6"></div>
                    </div>
                ) : (
                    <button className="submit" onClick={submit}>Create</button>
                )}
                <div>
                    { isPending && (
                        <div className="flex justify-center m-5">
                            <div className="spinner h-16 w-16"></div>
                        </div>
                    )}
                    { matches && (
                        <Bracket matchData={matches} categoryName="" />
                    )}
                    { qualMatches && (
                        <>
                            { qualMatches.length > 0 && (
                                <QualifyingMatches matches={qualMatches} allMatches={matches} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}