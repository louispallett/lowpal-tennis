import axios from "axios";
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import Loader from "../Auxiliary/Loader.jsx";

import racketRed from "/assets/images/racket-red.svg";
import racketBlue from "/assets/images/racket-blue.svg";

import HostSection from "./HostSection.jsx";
import Bracket from "./Bracket.jsx";

export default function Dashboard() {
    const { tournamentId } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = () => {
            const token = localStorage.getItem("Authorization");
            if (!token) window.location.assign("/");
            axios.get("/api/tournaments/get-tournament-info", {
                headers: { 
                    Authorization: token,
                    TournamentId: tournamentId
                }
            }).then((response) => {
                setData(response.data);
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        getData();
    }, []);

    return (
        <>
            <div className="flex justify-center items-center">
                {( loading && (
                    <Loader />
                ))}
                {( error && (
                    <></>
                ))}
            </div>
            <div className="flex flex-col gap-5 sm:mx-1.5 lg:mx-5">
                { data && (
                    <>
                        <TournamentInfo data={data} />
                        { data.host && (
                            <HostSection data={data} />
                        )}
                        <UserTeams teams={data.teams} />
                    </>
                )}
                <UserMatches />
                <TournamentResults />
                <Link to="/main">
                    <button className="submit">
                        Back to Tournament Selection Page
                    </button>
                </Link>
            </div>
        </>
    )
}

function TournamentInfo({ data }) {
    return (
        <div className="standard-container bg-lime-400">
            <h3>{data.tournament.name}</h3>
            <div className="tournament-grid-sm">
                <p className="standard-container bg-indigo-500 text-white">Code: {data.tournament.tournamentCode}</p>
                <p className="standard-container bg-indigo-500 text-white">Host: {data.tournament.host["name-long"]}</p>
                <p className="standard-container bg-indigo-500 text-white">Stage: <i>{data.tournament.stage}</i></p>
                <p className="standard-container bg-indigo-500 text-white">Date Created: {data.tournament.startDateFormatted}</p>
                <p className="standard-container bg-indigo-500 text-white">Number of players: {data.allPlayers}</p>
                <p className="standard-container bg-indigo-500 text-white">Number of active matches: {data.tournamentMatches.filter(match => match.state === "SCHEDULED" && match.participants.length > 1).length}</p>
            </div>
        </div>
    )
}

function UserTeams({ teams }) {
    return (
        <div className="standard-container bg-slate-100 flex flex-col gap-2.5 z-0">
            <h3>Your Teams</h3>
            { teams.length > 0 ? (
                <div className="tournament-grid-sm">
                    {teams.map(info => (
                        <div className="standard-container bg-indigo-600 text-white max-w-4xl">
                            <h5 className="standard-container mb-2.5 text-center bg-lime-400 shadow-none">{info.category.name}</h5>
                            <div className="flex justify-between flex-col lg:flex-row items-center gap-2.5">
                                <p className="standard-container bg-slate-100 shadow-none text-right">{info.players[0].user.firstName} {info.players[0].user.lastName}</p>
                                <p>and</p>
                                <p className="standard-container bg-slate-100 shadow-none">{info.players[1].user.firstName} {info.players[1].user.lastName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center gap-8">
                    <div className="racket-cross-wrapper">
                        <img src={racketRed} alt="" />
                        <img src={racketBlue} alt="" />
                    </div>
                    <p>You aren't part of any teams</p>
                </div>
            )}        
        </div>
    )
}

function UserMatches() {
    const { tournamentId } = useParams();
    const [matches, setMatches] = useState(null);

    useEffect(() => {
        const getUserMatches = () => {
            const token = localStorage.getItem("Authorization");
            axios.get("/api/match/get-user-matches", {
                headers: { 
                    Authorization: token,
                    tournamentId
                }
            }).then(response => {
                setMatches(response.data.userMatchData);
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
    
            });
        }

        getUserMatches();
    }, [])

    return (
        <div className="standard-container bg-slate-100 flex flex-col gap-2.5 z-0">
            <h3>Your Upcoming Matches</h3>
            { matches && (
                <>
                    { matches.length > 0 ? (
                        <div className="tournament-grid-sm">
                            {matches.map(item => (
                                <MatchCard data={item} key={item._id} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-8">
                            <div className="racket-cross-wrapper">
                                <img src={racketRed} alt="" />
                                <img src={racketBlue} alt="" />
                            </div>
                            <p>Looks like you haven't got any upcoming matches!</p>
                        </div>
                    )}
                </>   
            )}    
        </div>
    )
}

function MatchCard({ data }) {
    return (
        <Link to={"match/" + data._id}>
            <div className="standard-container h-full bg-indigo-600 text-white max-w-4xl hover:bg-indigo-500">
                <h5 className="standard-container mb-2.5 text-center bg-lime-400 shadow-none">{data.category.name}</h5>
                <div className="flex justify-between flex-col lg:flex-row items-center gap-2.5">
                    <p className="standard-container bg-slate-100 shadow-none">{data.participants.length > 0 ? data.participants[0].name : "TBC"}</p>
                    <p>vs</p>
                    <p className="standard-container bg-slate-100 shadow-none">{data.participants.length > 1 ? data.participants[1].name : "TBC"}</p>
                </div>
                <div className="flex gap-2.5">
                    <p className="standard-container bg-slate-100 shadow-none mt-2.5">Deadline: {data.deadline}</p>
                    <p className="standard-container bg-slate-100 shadow-none mt-2.5">Round: {data.tournamentRoundText}</p>
                </div>
            </div>
        </Link>
    )
}

function TournamentResults() {
    const { tournamentId } = useParams();
    const [matches, setMatches] = useState(null);
    const [groupedMatches, setGroupedMatches] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getMatches = () => {
            axios.get("/api/match/get-matches", {
                headers: { tournamentId }
            }).then(response => {
                const validMatches = response.data.matches.filter(match => !match.qualifyingMatch);
                const groupedMatchesObj = validMatches.reduce((acc, match) => {
                    const categoryId = match.category._id;
                    
                    if (!acc[categoryId]) {
                        acc[categoryId] = [];
                    }
                    
                    acc[categoryId].push(match);
                    return acc;
                }, {});
                const allMatchesGrouped = Object.values(groupedMatchesObj);
                console.log(allMatchesGrouped);
                setGroupedMatches(allMatchesGrouped);
                setMatches(response.data.matches);
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        getMatches();
    }, [])
    return (
        <div className="standard-container bg-slate-100 flex flex-col gap-2.5 z-0">
            <h3>Tournament Results</h3>
            { matches && (
                <div className="flex flex-col items-center gap-2.5">
                    { matches.length > 0 ? (
                        <>
                            { groupedMatches.map(item => (
                                <Bracket matchData={item} categoryName={item[0].category.name} key={item._id} />
                            ))}
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-8">
                            <div className="racket-cross-wrapper">
                                <img src={racketRed} alt="" />
                                <img src={racketBlue} alt="" />
                            </div>
                            <p>Matches for this tournament haven't been created yet!</p>
                        </div>
                    )}
                </div>
            )}
            <div className="flex justify-center">
                { loading && (
                    <Loader />
                )}
            </div>
        </div>
    )
}