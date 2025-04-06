import axios from "axios";
import _ from "lodash";

import { useEffect, useState } from "react";
import racketRed from "/assets/images/racket-red.svg";
import racketBlue from "/assets/images/racket-blue.svg";
import { Link } from "react-router-dom";

export default function TournamentSelect() {
    const [userInfo, setUserInfo] = useState(false);
    const [serverError, setServerError] = useState(false);
    let tournamentsPlaying = {}, tournamentsHosting = {}

    useEffect(() => {
        const getuserInfo = () => {
            const token = localStorage.getItem("Authorization");
            if (!token) window.location.assign("/");
            axios.get("/api/tournaments/get-user-tournaments", {
                    headers: { Authorization: token }
                }).then((response) => {
                    setUserInfo(response.data);
                }).catch((err) => {
                    if (err.response.status === 403) {
                        localStorage.removeItem("Authorization");
                        window.location.assign("/");
                    } else {
                        console.log(err);
                        setServerError({ status: err.response.status, statusText: err.response.statusText });
                    }
                });
        }
        getuserInfo();
    }, []);
    
    let isHosting;
    let isPlaying;

    if (userInfo) {
        tournamentsPlaying = {
            signUps: userInfo.tournamentsPlaying.filter(x => x.stage === "sign-up"),
            actives: userInfo.tournamentsPlaying.filter(x => x.stage === "play"),
            finished: userInfo.tournamentsPlaying.filter(x => x.stage === "finished")
        }
        tournamentsHosting = {
            signUps: userInfo.tournamentsHosting.filter(x => x.stage === "sign-up"),
            actives: userInfo.tournamentsHosting.filter(x => x.stage === "play"),
            finished: userInfo.tournamentsHosting.filter(x => x.stage === "finished")
        }
        isHosting = tournamentsHosting.signUps.length > 0 || tournamentsHosting.actives.length > 0 || tournamentsHosting.finished.length > 0;
        isPlaying = tournamentsPlaying.signUps.length > 0 || tournamentsPlaying.actives.length > 0 || tournamentsPlaying.finished.length > 0;

        // We want to write some code here to REMOVE any matches from isPlaying if they exist in isHosting...
    }

    return (
        <div className="flex flex-col gap-2.5 mx-5">
            <div className="form-input bg-lime-400">
                <h3 className="md:text-center">Dashboard</h3>
            </div>
            <div className="racket-cross-wrapper">
                <img src={racketRed} alt="" />
                <img src={racketBlue} alt="" />
            </div>
            { userInfo ? (
                <>
                    { isHosting && (
                        <>
                            <div className="form-input bg-indigo-500 text-white">
                                <h4 className="italic">Hosting tournaments</h4>
                            </div>
                            { tournamentsHosting.signUps.length > 0 && (
                                <div className="flex flex-col gap-2.5">
                                    { tournamentsHosting.signUps.map((item) => (
                                        <UserTournamentHosting data={item} tournamentsPlaying={tournamentsPlaying} key={item._id} />
                                    ))}
                                    <div className="racket-cross-wrapper">
                                        <img src={racketRed} alt="" />
                                        <img src={racketBlue} alt="" />
                                    </div>
                                </div>
                            )}
                            { tournamentsHosting.actives.length > 0 && (
                                <div className="flex flex-col gap-2.5">
                                    { tournamentsHosting.actives.map((item) => (
                                        <UserTournamentHosting data={item} tournamentsPlaying={tournamentsPlaying} key={item._id} />
                                    ))}
                                </div>
                            )}
                            { tournamentsHosting.finished.length > 0 && (
                                <div className="flex flex-col gap-2.5">
                                    { tournamentsHosting.finished.map((item) => (
                                        <UserTournamentHosting data={item} tournamentsPlaying={tournamentsPlaying} key={item._id} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    { isPlaying && (
                        <>
                            <div className="mt-2.5 form-input bg-indigo-500 text-white">
                                <h4 className="italic">Joined Tournaments</h4>
                            </div>
                            { tournamentsPlaying.signUps.length > 0 && (
                                <div className="flex flex-col gap-2.5">
                                    { tournamentsPlaying.signUps.map((item) => (
                                        <UserTournamentPlaying data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                            { tournamentsPlaying.actives.length > 0 && (
                                <div className="flex flex-col gap-2.5">
                                    { tournamentsPlaying.actives.map((item) => (
                                        <UserTournamentPlaying data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                            { tournamentsPlaying.finished.length > 0 && (
                                <div className="flex flex-col gap-2.5">
                                    { tournamentsPlaying.finished.map((item) => (
                                        <UserTournamentPlaying data={item} key={item._id} />
                                    ))}
                                </div>
                            )}
                            <div className="racket-cross-wrapper">
                                <img src={racketRed} alt="" />
                                <img src={racketBlue} alt="" />
                            </div>

                        </>
                    )}
                </>
            ) : (
                <>
                    {/* Add loading here */}
                </>
            )}
            <CreateORJoin />
        </div>
    )
}

function UserTournamentPlaying({ data }) {
    return (
        <Link to={"tournament/" + data._id} className="form-input bg-lime-500 hover:bg-lime-400">
            <h3>{data.name}</h3>
            <div className="tournament-grid-sm">
                <p className="form-input bg-indigo-500 text-white">Host: {data.host["name-long"]}</p>
                <p className="form-input bg-indigo-500 text-white">Stage: <i>{data.stage}</i></p>
                <p className="form-input bg-indigo-500 text-white">Date Created: {data.startDateFormatted}</p>
            </div>
        </Link>
    )
}

function UserTournamentHosting({ data, tournamentsPlaying }) {
    console.log(data);
    const joined = tournamentsPlaying.signUps.some(item => item._id === data._id) || tournamentsPlaying.actives.some(item => item._id === data._id);
    const isFinished = data.stage === "finished";

    return (
        <div className="flex gap-1.5 lg:flex-row flex-col">
            <Link to={"tournament/" + data._id} className="form-input bg-lime-500 hover:bg-lime-400">
                <h3>{data.name}</h3>
                <div className="tournament-grid-sm">
                    <p className="form-input bg-indigo-500 text-white">Host: {data.host["name-long"]}</p>
                    <p className="form-input bg-indigo-500 text-white">Stage: <i>{data.stage}</i></p>
                    <p className="form-input bg-indigo-500 text-white">Date Created: {data.startDateFormatted}</p>
                </div>
            </Link>
            { joined ? (
                <div className={isFinished ? "hidden" : "tournament-joined"}>
                    <div className="flex lg:flex-col justify-center items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#054205" className="size-24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p className="text-center">Playing in tournament</p>
                    </div>
                </div>
            ) : (
                <Link to="users/join-existing-tournament-form" state={{ data }} className={isFinished ? "hidden" : "tournament-join"}>
                    <div className="flex lg:flex-col justify-center items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#054205" className="size-24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                        </svg>
                        <p className="text-center">Join this tournament</p>
                    </div>
                </Link>
            )}
        </div>
    )
}

function CreateORJoin() {
    return (
        <>
            <div className="mt-2.5 form-input bg-indigo-500 text-white">
                <h4 className="italic text-center">Create or join a new tournament</h4>
            </div>
            <div className="flex flex-col md:grid grid-cols-2 gap-2.5">
                <Link to="users/create-tournament" className="tournament-join">
                    <div className="flex lg:flex-col justify-center items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#054205" className="size-24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                    </svg>

                        <p className="text-center">Create a new tournament</p>
                    </div>
                </Link>
                <Link to="users/join-existing-tournament" className="tournament-join">
                    <div className="flex lg:flex-col justify-center items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#054205" className="size-24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                        </svg>
                        <p className="text-center">Join an existing tournament</p>
                    </div>
                </Link>
            </div>
        </>
    )
}