import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Dialog } from '@headlessui/react';

import Loader from "../Auxiliary/Loader";
import tennisBall from "/assets/images/tennis-ball.svg";
import errorSVG from "/assets/images/error.svg";

export default function Category() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tournamentInfo, setTournamentInfo] = useState(null);
    const { tournamentId, categoryId } = useParams();

    useEffect(() => {
        const getCategoryDetails = () => {
            axios.get("/api/categories/get-category-detail", {
                headers: {
                    categoryId
                }}
            ).then((response) => {
                setTournamentInfo(response.data);
            }).catch((err) => {
                console.log(err);
                setError(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        getCategoryDetails();
    }, [])
    return (
        <>
            <div className="flex justify-center items-center">
                {( loading && (
                    <Loader />
                ))}
            </div>
            <div className="flex flex-col gap-5 mx-1.5 md:mx-5">
                { tournamentInfo && (
                    <>
                        <div className="form-input bg-lime-400">
                            <h3>{tournamentInfo.category.name}</h3>
                        </div>
                        <CategoryInfo tournamentInfo={tournamentInfo} />
                        <Actions tournamentInfo={tournamentInfo} />
                        <DangerZone />
                    </>
                )}
                { error && (
                    <>
                        <img src={errorSVG} alt="" className="h-24"/>
                        <div className="text-center">
                            <p>{error}</p>
                            <p>Sorry about that! Some sort of error has occured. If the issue keeps persisting, please contact the administrator.</p>
                        </div>
                    </>
                )}
                <Link to={"/main/tournament/" + tournamentId}>
                    <button className="submit">
                        Back to Tournament Page
                    </button>
                </Link>
            </div>
        </>
    )
}

function CategoryInfo({ tournamentInfo }) {
    const noOfMales = tournamentInfo.players.filter(player => player.male).length;
    const seeded = tournamentInfo.players.filter(player => player.seeded).length;

    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5">
            <h3>Category Information</h3>
            <div className="tournament-grid-sm">
                <p className="form-input">Number of players: {tournamentInfo.players.length}</p>
                <p className="form-input">Number of active matches: {tournamentInfo.matches.filter(match => match.state === "SCHEDULED").length}</p>
                <p className="form-input">Males: {noOfMales}</p>
                <p className="form-input">Females: {tournamentInfo.players.length - noOfMales}</p>
                <p className="form-input">Seeded: {seeded}</p>
                <p className="form-input">Non-Seeded: {tournamentInfo.players.length - seeded}</p>
            </div>
            <div className="form-input bg-indigo-500">
                <h4 className="text-white">Players</h4>
                { tournamentInfo.players.length < 1 ? (
                    <div className="form-input bg-slate-100 flex gap-2.5 justify-center items-center">
                        <img src={tennisBall} className="h-16" id="spinner" alt="" />
                        <h4>No players yet!</h4>
                    </div>
                ) : (
                    <div className="tournament-grid-sm">
                        { tournamentInfo.players.map((player) => (
                            <PlayerCard info={player} key={player._id} />
                        ))}
                    </div>
                )}
            </div>
            { tournamentInfo.category.doubles && (
                <>
                    { tournamentInfo.teams.length > 0 && (
                        <div className="form-input bg-indigo-500">
                            <h4 className="text-white">Teams</h4>
                            <div className="tournament-grid-sm">
                                { tournamentInfo.teams.map((team) => (
                                    <TeamCard info={team} key={team._id} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function PlayerCard({ info, key }) {
    return (
        <div className="form-input bg-slate-100">
            <p>{info.user.firstName} {info.user.lastName}</p>
            <p>Gender: {info.male ? "male" : "female"}</p>
            <p>Seeded: {info.seeded ? "yes" : "no"}</p>
            <p>Ranking: {info.ranking === 0 ? "Not assigned" : info.ranking}</p>
        </div>
    )
}

function TeamCard({ info, key }) {
    return (
        <div className="form-input bg-slate-100">
            <p>{info.players[0].firstName} {info.players[0].lastName}</p>
            <p>{info.players[1].firstName} {info.players[1].lastName}</p>
            <p>Ranking: {info.ranking === 0 ? "Not assigned" : info.ranking}</p>
        </div>
    )
}

function Actions({ tournamentInfo }) {
    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5">
            <h3>Category Operations</h3>
            { tournamentInfo.category.tournament.stage === "finished" ? (
                <p>Finished</p>
            ) : (
                <>
                    { tournamentInfo.category.tournament.stage === "play" && !tournamentInfo.category.locked ? (
                        <>
                            <h4>Creating Matches & Teams</h4>
                            <p>Now that registration for this tournament is closed, you can create the matches and teams.</p>
                            <div>
                                { tournamentInfo.category.doubles ? (
                                    <>
                                        { tournamentInfo.teams && (
                                            <>
                                                { tournamentInfo.teams.length < 1 ? (
                                                    <>
                                                        <p className="mb-2.5">
                                                            Since this is a doubles category, you'll first need to create the teams. This works by randomizing the players and then pairing them together.
                                                            If this category has seeded players, each seeded player will be matched with a non-seeded player until there are none left, and the remaining 
                                                            non-seeded players will be matched together.
                                                        </p>
                                                        <CreateTeams playersLength={tournamentInfo.players.length}  />
                                                    </>
                                                ) : (
                                                    <CreateMatches />
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <CreateMatches />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <p>
                                This tournament is currently in sign-up mode. In order to create teams and matches, you need to first close sign-up for the
                                entire tournament. Please note that this is irreversible - once you've closed the tournament you cannot reopen it! Head back to
                                the main tournament page and select 'Close Registration' to close registration for this tournament.
                            </p>
                            <p>
                                Once the tournament is closed, you can come back here and create the matches and teams for this tournament.
                            </p>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

function CreateTeams({ playersLength }) {
    const { tournamentId, categoryId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState(null);
    const [error, setError] = useState(null);

    const checkPlayerRankings = () => {
        setLoading(true);
        if (isOpen) {
            axios.post("/api/teams/create-teams", {
                categoryId
            }).then(response => {
                setTeams(response.data.teams);
            }).catch((err) => {
                setError(err.message);
            }).finally(() => {
                setIsOpen(false);
                setLoading(false);
            });
        } else {
            axios.get("/api/players/check-player-rankings", {
                headers: { tournamentId }
            }).then((response) => {
                const zeroPlayers = response.data.zeroPlayers;
                if (zeroPlayers.length > 0) {
                    setIsOpen(true);
                } else {
                    axios.post("/api/teams/create-teams", {
                        categoryId
                    }).then(response => {
                        setTeams(response.data.teams);
                    }).catch((err) => {
                        setError(err.message);
                    });
                }
            }).catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    return (
        <>
            { playersLength < 8 ? (
                <div className="button-disabled">
                    <p className="text-center">There must be at least 8 players in a doubles category before you create teams.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2.5">
                    { isOpen && (
                        <div className="form-input px-2.5 text-base">
                            <h5 className="text-red-700">Warning</h5>
                            <p>
                                One or more players in your tournament has a zero (0) ranking. You may continue in creating teams and matches, however
                                the matches will not be organised strategically. This is not recommended for larger tournaments.
                            </p>
                            <p>If you wish to continue, please click 'Create Teams' again.</p>
                            <p>You can read more about strategically organised tournaments in the <Link to="/about" className="text-click">About</Link> section.</p>
                        </div>
                    )}
                    { loading ? (
                        <button className="submit cursor-wait flex justify-center">
                            <div className="spinner h-6 w-6"></div>
                        </button>
                    ) : (
                        <button
                            className={ teams ? "hidden" : "submit text-center"}
                            onClick={checkPlayerRankings}
                        >
                            Create teams
                        </button>
                    )}
                </div>
            )}
        </>
    )
}

function CreateMatches() {
    return (
        <button
            className="submit text-center"
        >
            Create matches
        </button>
    )
}

function DangerZone() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5">
            <h3>Danger Zone</h3>
            <p>These operations are permanent and should only be used when necessary. You have been warned.</p>
            <div className="flex gap-2.5">
                <button className="danger"
                    onClick={() => setIsOpen(true)}
                >
                    Delete Category
                </button>
            </div>
            <DeleteDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}

function DeleteDialog({ isOpen, setIsOpen }) {
    return (
        <Dialog as="div" open={isOpen != false ? true : false} onClose={() => setIsOpen(false)} className="relative z-50 m-0 p-0">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <Dialog.Panel className="form-input text-base bg-slate-50 sm:p-6 overflow-y-auto max-h-[90vh]">
                    <div className="flex flex-col gap-2.5">
                        <h3>Delete this Category</h3>
                        <p></p>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
        
    )
}