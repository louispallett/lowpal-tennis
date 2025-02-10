import { useEffect, useState } from "react";
import racketRed from "/assets/images/racket-red.svg";
import racketBlue from "/assets/images/racket-blue.svg";

export default function TournamentSelect() {
    const [userTournaments, setUserTournaments] = useState(null);

    useEffect(() => {
        
    }, []);

    return (
        <div className="flex flex-col gap-2.5 mx-5">
            <div className="form-input bg-lime-400">
            <img src={racketRed} alt="" className="hidden lg:block transform -scale-x-100 w-16 lg:w-36 h-auto lg:absolute flex-shrink-0 -left-4 -top-8 z-30" />
            <img src={racketBlue} alt="" className="hidden lg:block w-16 lg:w-36 h-auto lg:absolute flex-shrink-0 -right-4 -top-8 z-30" />
                <h3 className="md:text-center">Select a tournament below:</h3>
            </div>
            {/* Run this as 'for each sign-up tournament, for each active, for each finished (see 
            Dashboard.jsx notes) */}
            <div className="mt-8 form-input bg-indigo-500 text-white">
                <h4 className="italic">Tournaments in Sign-Up stage</h4>
            </div>
            <div className="tournament-grid">
                <UserTournament data={userTournaments} />
            </div>
            <div className="mt-8 form-input bg-indigo-500 text-white">
                <h4 className="italic">Active Tournaments</h4>
            </div>
            <div className="tournament-grid">
                <UserTournament data={userTournaments} />
                <UserTournament data={userTournaments} />
            </div>
            <div className="mt-8 form-input bg-indigo-500 text-white">
                <h4 className="italic">Finished tournaments</h4>
            </div>
            <div className="tournament-grid">
                <UserTournament data={userTournaments} />
                <UserTournament data={userTournaments} />
                <UserTournament data={userTournaments} />
                <UserTournament data={userTournaments} />
            </div>
        </div>
    )
}

function UserTournament({ data }) {
    return (
        <div className="form-input bg-lime-500">
            <h3>Tournament Name</h3>
            <div className="tournament-grid-sm">
                <p className="form-input bg-indigo-500 text-white">Host</p>
                <p className="form-input bg-indigo-500 text-white">Stage</p>
                <p className="form-input bg-indigo-500 text-white">Number of players</p>
                <p className="form-input bg-indigo-500 text-white">Total Matches</p>
                <p className="form-input bg-indigo-500 text-white">Active matches</p>
                <p className="form-input bg-indigo-500 text-white">Date Created</p>
            </div>
        </div>
    )
}

