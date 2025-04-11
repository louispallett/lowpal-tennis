/*==============================================================================================================
 * Dashboard.jsx
 * -------------------------------------------------------------------------------------------------------------
 *
 *  This is our main page where all information about a tournament can be accessed. Currently, we are running on
 *  the notion of ONE tournament per host/player, but I should change this in the future to run this as:
 *
 *  	Sign in -> Tournament selection page -> Tournament page
 *
 *  Sign in page (/users/sign-in)
 *  	Our normal sign in page, nothing too interesting - returns JWT and reloads to selection page
 *  
 *  Tournament selection page (/dashboard)
 *  	This is a simple page which fetches the user's tournament via their JWT. It then fetches the basic 
 *  	information about each tournament (just what is on the tournament models) and displays them. The user 
 *  	can then select which tournament they want to go to and it will send them to the relevant page.
 *
 *  	NOTE: Under tournament selection page, we should split these by stage - "Sign Up", "Active", and "Finished".
 *  	So, three different sections, each for a stage. Then, within the stages, we should pass order them by the 
 *  	date started. So:
 *
 *  		Sign Up:
 *  			Latest tournament - created today
 *  			Mid tournament - created 1 week ago
 *  			Earliest tournament - created 3 weeks ago
 *
 *  		Active: 
 *  			Latest - created today
 *  			Earliest - created 6 months ago
 *
 *  		Finished:
 *  			Latest - created 4 months ago
 *  			Earliest - created 2 years ago
 *
 *	This means that, even if someone had a small tournament they hosted and finished a few weeks ago, it's not 
 *	going to appear BEFORE an ONGOING tournament which started 6 months ago. We should probably title these!
 *  			
 *
 *  Tournament dashboard page (/dashboard/:tournamentId)
 *  	This is the page which contains ALL the major information about the tournament. It will contain:
 *  		- Tournament name and details
 *  		- User matches (selectable - they go to:
 *  			-> match page (/:matchId)
 *  				-> Info on match
 *  				-> Player contact details
 *  				-> Results submission form
 *  		- Current results of each category
 *  		- Tournament rules
 *  			-> NOTE: This will require use of a rich text editor of some kind - probably best to 
 *  			use TinyMCE again...
 *  	Anything else?
 *
 * The aim of this is to make as few pages as possible, which is a better UI and reduces complexity. It also means
 * we can make fewer requests and utilize :variables in the address. This means we can fetch the tournaments the user
 * is signed up to via the JWT, and then the tournament info via the :variable.
 *
 * NOTE: Put a 'Jump to' section at the top of the dashboard page for easier navigation. Do NOT fix the menu bar
 * as an absolute element otherwise this will not help with the jump feature.
 *
*/

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
                            { data.teams.length > 0 && (
                                <UserTeams teams={data.teams} />
                            )}
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
        <p>{teams[0].ranking}</p>
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