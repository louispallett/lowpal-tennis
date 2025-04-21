import axios from "axios";
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import Loader from "../Auxiliary/Loader.jsx";

import racketRed from "/assets/images/racket-red.svg";
import racketBlue from "/assets/images/racket-blue.svg";

import HostSection from "./HostSection.jsx";

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
            <div className="flex flex-col gap-5 mx-1 sm:mx-1.5 lg:mx-5">
                { data && (
                    <>
                        <TournamentInfo data={data} />
                        { data.host && (
                            <HostSection data={data} />
                        )}
                        <UserTeams teams={data.teams} />
                        <UserMatches matches={data.matches} />
                        <TournamentResults matches={data.matches} />
                    </>
                    )}
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
        <div className="form-input bg-lime-400">
            <h3>{data.tournament.name}</h3>
            <div className="tournament-grid-sm">
                <p className="form-input bg-indigo-500 text-white">Code: {data.tournament.tournamentCode}</p>
                <p className="form-input bg-indigo-500 text-white">Host: {data.tournament.host["name-long"]}</p>
                <p className="form-input bg-indigo-500 text-white">Stage: <i>{data.tournament.stage}</i></p>
                <p className="form-input bg-indigo-500 text-white">Date Created: {data.tournament.startDateFormatted}</p>
                <p className="form-input bg-indigo-500 text-white">Number of players: {data.allPlayers}</p>
                <p className="form-input bg-indigo-500 text-white">Number of active matches: {data.tournamentMatches.filter(match => match.state === "SCHEDULED").length}</p>
            </div>
        </div>
    )
}

function EditSettings({ data }) {
    return (
        <>

        </>
    )
}

function UserTeams({ teams }) {
    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5 z-0">
            <h3>Your Teams</h3>
            { teams.length > 0 ? (
                <div className="tournament-grid-sm">
                    {teams.map(info => (
                        <div className="form-input bg-indigo-600 text-white max-w-4xl" key={info._id}>
                            <h5 className="form-input mb-2.5 text-center bg-lime-400 shadow-none">{info.category.name}</h5>
                            <div className="flex justify-between flex-col lg:flex-row items-center gap-2.5">
                                <p className="form-input bg-slate-100 shadow-none">{info.players[0].user.firstName} {info.players[0].user.lastName}</p>
                                <p>and</p>
                                <p className="form-input bg-slate-100 shadow-none">{info.players[1].user.firstName} {info.players[1].user.lastName}</p>
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

function UserMatches({ matches }) {
    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5 z-0">
            <h3>Your Upcoming Matches</h3>
            { matches.length > 0 ? (
                <>
                    {matches.map(item => {
                        <MatchCard data={item} key={item._id} />
                    })}
                </>
            ) : (
                <div className="flex flex-col justify-center items-center gap-8">
                    <div className="racket-cross-wrapper">
                        <img src={racketRed} alt="" />
                        <img src={racketBlue} alt="" />
                    </div>
                    <p>Looks like you haven't got any upcoming matches!</p>
                </div>
            )}        
        </div>
    )
}

function MatchCard({ data }) {

}

function TournamentResults({ matches }) {
    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5 z-0">
            <h3>Tournament Results</h3>
            { matches.length > 0 ? (
                <>
                    {matches.map(item => {
                        <Bracket data={item} key={item._id} />
                    })}
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
    )
}

function Bracket({ data }) {

}