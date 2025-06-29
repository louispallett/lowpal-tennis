"use client"

import { createMixedTeams, createTeams } from "@/lib/createTeams"
import { CategoryType, PlayerTypeClient, TeamType, TeamTypeClient } from "@/lib/types"
import axios from "axios"
import { useState } from "react"

type CreateTeamsProps = {
    category:CategoryType
    players:PlayerTypeClient[]
}

const extractIds = (players:PlayerTypeClient[]):string[] => {
    const result:string[] = [];
    for (const player of players) {
        result.push(player._id);
    }
    return result;
}

export default function CreateTeams({ category, players }:CreateTeamsProps) {
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    
    const generateTeams = () => {
        setLoading(true);
        let newTeams:string[][] = [];
        const seeded = players.filter(x => x.seeded);
        const nonSeeded = players.filter(x => !x.seeded)
        if (category.name === "Mixed Doubles") {
            let maleSeeded = seeded.filter(x => x.male);
            let femaleSeeded = seeded.filter(x => !x.male);
            let maleNonSeeded = nonSeeded.filter(x => x.male);
            let femaleNonSeeded = nonSeeded.filter(x => !x.male);
            newTeams = createMixedTeams(
                extractIds(maleSeeded),
                extractIds(maleNonSeeded), 
                extractIds(femaleSeeded), 
                extractIds(femaleNonSeeded),
            );
        } else {
            newTeams = createTeams(extractIds(seeded), extractIds(nonSeeded));
        }
        const teamObjs = [];
        for (let team of newTeams) {
            const player1 = players.find(x => x._id == team[0]);
            const player2 = players.find(x => x._id == team[1]);
            const teamObj = {
                tournament: category.tournament,
                category: category._id,
                players: [player1, player2],
                ranking: player1!.ranking + player2!.ranking
            };
            teamObjs.push(teamObj);
        }
        setTeams(teamObjs);
        setLoading(false);
    }

    return (
        <>
            <button className="submit"
                onClick={generateTeams}
            >
                Generate Teams
            </button>
            { teams.length > 0 && (
                <div className="standard-container">
                    <h3>Generated Teams</h3>
                    <div className="tournament-grid-sm">
                        { teams.map((team) => (
                            <TeamCard info={team} players={players} key={teams.indexOf(team)} />
                        ))}
                    </div>
                    <SaveTeams teams={teams} />
                </div>
            )}
        </>
    )
}

type TeamCardProps = {
    info:TeamTypeClient,
    players:PlayerTypeClient[]
}

function TeamCard({ info }:TeamCardProps) {
    return (
        <div className="standard-container bg-slate-100">
            <p>{info.players[0].user.firstName} {info.players[0].user.lastName}</p>
            <p>{info.players[1].user.firstName} {info.players[1].user.lastName}</p>
            <p>Ranking: {info.ranking}</p>
        </div>    
    )
}

interface TeamsLite {
    category:string,
    players:PlayerTypeClient[],
    ranking:number
};

type SaveTeamsProps = {
    teams:TeamsLite[]
};

function SaveTeams({ teams }:SaveTeamsProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const saveTeams = () => {
        setLoading(true);
        axios.post(`/api/team`, { 
            teams 
        }).then(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }).catch((err:any) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <button className="flex justify-center items-center success mt-2.5"
            onClick={(success || loading) ? function() {} : saveTeams}
        >
            { loading ? (
                <div className="spinner h-4 w-4"></div>
            ) : (
                <>
                    { success ? (
                        <div className="flex gap-1.5">
                            <p>Success! Redirecting...</p>
                            <div className="spinner h-4 w-4"></div>
                        </div>
                    ) : (
                        <>Save Teams</>
                    )}
                </>
            )}
        </button>
    )
}