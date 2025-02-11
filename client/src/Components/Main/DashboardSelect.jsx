import axios from "axios";
import _ from "lodash";

import { useEffect, useState } from "react";
import racketRed from "/assets/images/racket-red.svg";
import racketBlue from "/assets/images/racket-blue.svg";
import { Link } from "react-router-dom";

export default function TournamentSelect() {
    const [userInfo, setUserInfo] = useState(false);
    let tournamentsPlaying = {}, tournamentsHosting = {}

    useEffect(() => {
        const getuserInfo = () => {
            const token = localStorage.getItem("Authorization");
            if (!token) window.location.assign("/");
            axios.get("/api/users/get-user-tournaments", {
                    headers: { Authorization: token }
                })
                .then((response) => {
                    console.log(response.data)
                    setUserInfo(response.data);
                }).catch((err) => {
                    console.log(err);
                });
            
        }

        getuserInfo();
    }, []);

    let isHosting;
    let isPlaying;

    if (userInfo) {
        tournamentsPlaying = {
            signUps: userInfo.userTournamentsPlaying.filter(x => x.stage === "sign-up"),
            actives: userInfo.userTournamentsPlaying.filter(x => x.stage === "play"),
            finished: userInfo.userTournamentsPlaying.filter(x => x.stage === "finished")
        }
        // console.log(tournamentsPlaying);
        tournamentsHosting = {
            signUps: userInfo.userTournamentsHosting.filter(x => x.stage === "sign-up"),
            actives: userInfo.userTournamentsHosting.filter(x => x.stage === "play"),
            finished: userInfo.userTournamentsHosting.filter(x => x.stage === "finished")
        }
        isHosting = tournamentsHosting.signUps.length > 0 || tournamentsHosting.actives.length > 0 || tournamentsHosting.finished.length > 0;
        isPlaying = tournamentsPlaying.signUps.length > 0 || tournamentsPlaying.actives.length > 0 || tournamentsPlaying.finished.length > 0;    
    }

    return (
        <div className="flex flex-col gap-2.5 mx-5">
            <div className="form-input bg-lime-400">
            <img src={racketRed} alt="" className="hidden lg:block transform -scale-x-100 w-16 lg:w-36 h-auto lg:absolute flex-shrink-0 -left-4 -top-8 z-30" />
            <img src={racketBlue} alt="" className="hidden lg:block w-16 lg:w-36 h-auto lg:absolute flex-shrink-0 -right-4 -top-8 z-30" />
                <h3 className="md:text-center">Select a tournament below:</h3>
            </div>
            { userInfo ? (
                <>
                    { isHosting && (
                        <>
                            <div className="mt-8 form-input bg-indigo-500 text-white">
                                <h4 className="italic">Hosting tournaments</h4>
                            </div>
                            { tournamentsHosting.signUps.length > 0 && (
                                <div className="tournament-grid">
                                    { tournamentsHosting.signUps.map((item) => (
                                        <UserTournament data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                            { tournamentsHosting.actives.length > 0 && (
                                <div className="tournament-grid">
                                    { tournamentsHosting.actives.map((item) => (
                                        <UserTournament data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                            { tournamentsHosting.finished.length > 0 && (
                                <div className="tournament-grid">
                                    { tournamentsHosting.finished.map((item) => (
                                        <UserTournament data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    { isPlaying && (
                        <>
                            <div className="mt-8 form-input bg-indigo-500 text-white">
                                <h4 className="italic">Hosting tournaments</h4>
                            </div>
                            { tournamentsPlaying.signUps.length > 0 && (
                                <div className="tournament-grid">
                                    { tournamentsPlaying.signUps.map((item) => (
                                        <UserTournament data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                            { tournamentsPlaying.actives.length > 0 && (
                                <div className="tournament-grid">
                                    { tournamentsPlaying.actives.map((item) => (
                                        <UserTournament data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                            { tournamentsPlaying.finished.length > 0 && (
                                <div className="tournament-grid">
                                    { tournamentsPlaying.finished.map((item) => (
                                        <UserTournament data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <>
                
                </>
            )}
            {/* <div className="mt-8 form-input bg-indigo-500 text-white">
                <h4 className="italic">Active Tournaments</h4>
            </div>
            <div className="tournament-grid">

            </div>
            <div className="mt-8 form-input bg-indigo-500 text-white">
                <h4 className="italic">Finished tournaments</h4>
            </div>
            <div className="tournament-grid">

            </div> */}
        </div>
    )
}

function UserTournament({ data }) {
    const [tournamentInfo, setTournamentInfo] = useState(false);

    useEffect(() => {
        const getTournamentInfo = () => {
            axios.get("/api/tournaments/get-tournament-info", {
                headers: { tournamentId: data._id }
            }).then((response) => {
                setTournamentInfo(response.data);
            }).catch ((err) => {
                console.log(err);
            });
        }
        getTournamentInfo();
    }, []);

    console.log(tournamentInfo);

    return (
        <Link to={data._id} className="form-input bg-lime-500 hover:bg-lime-400">
            <h3>{data.name}</h3>
            <div className="tournament-grid-sm">
                <p className="form-input bg-indigo-500 text-white">Host: {data.host["name-long"]}</p>
                <p className="form-input bg-indigo-500 text-white">Stage: <i>{data.stage}</i></p>
                <p className="form-input bg-indigo-500 text-white">Number of players: {tournamentInfo.nOfPlayers}</p>
                <p className="form-input bg-indigo-500 text-white">Total Matches: {tournamentInfo.nOfMatches}</p>
                <p className="form-input bg-indigo-500 text-white">Active matches: {tournamentInfo.nOfActiveMatches}</p>
                <p className="form-input bg-indigo-500 text-white">Date Created: {data.startDateFormatted}</p>
            </div>
        </Link>
    )
}

