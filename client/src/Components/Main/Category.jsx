import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import tennisBall from "/assets/images/tennis-ball.svg";

export default function Category() {
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
            })
        }
        getCategoryDetails();
    }, [])
    return (
        <div className="flex flex-col gap-5 mx-1.5 md:mx-5">
            { tournamentInfo ? (
                <>
                    <div className="form-input bg-lime-400">
                        <h3>{tournamentInfo.category.name}</h3>
                    </div>
                    <CategoryInfo tournamentInfo={tournamentInfo} />
                    <Actions tournamentInfo={tournamentInfo} />
                </>
            ) : (
                <></>
            )}
            <Link to={"/main/tournament/" + tournamentId}>
                <button className="submit">
                    Back to Tournament Page
                </button>
            </Link>
        </div>
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

function PlayerCard({ info }) {
    return (
        <div className="form-input bg-slate-100">
            <p>{info.user.firstName} {info.user.lastName}</p>
            <p>Gender: {info.male ? "male" : "female"}</p>
            <p>Seeded: {info.seeded ? "yes" : "no"}</p>
            <p>Ranking: {info.ranking === 0 ? "Not assigned" : info.ranking}</p>
        </div>
    )
}

function TeamCard({ info }) {
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
                                                        <CreateTeam players={tournamentInfo.players} />
                                                    </>
                                                ) : (
                                                    <CreateMatches tournamentInfo={tournamentInfo} />
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <CreateMatches tournamentInfo={tournamentInfo} />
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

function CreateTeam({ players }) {
    return (
        <>
            { players.length < 8 ? (
                <div className="button-disabled">
                    <p className="text-center">There must be at least 8 players in a doubles category before you create teams.</p>
                </div>
            ) : (
                <Link to="create-teams">
                    <button
                        className="submit text-center"
                    >
                        Create teams
                    </button>
                </Link>
            )}
        </>
    )
}

function CreateMatches({ tournamentInfo }) {
    return (
        <>
            { tournamentInfo.category.doubles ? (
                <>
                    { tournamentInfo.teams.length < 1 ? (
                        <div className="button-disabled">
                            <p className="text-center">You must have at least 4 teams in this category to create matches.</p>
                        </div>
                    ) : (
                        <Link to="create-matches">
                            <button
                                className="submit text-center"
                            >
                                Create matches
                            </button>
                        </Link>
                    )}
                </>
            ) : (
                <>
                    { tournamentInfo.players.length < 4 ? (
                        <div className="button-disabled">
                            <p className="text-center">You must have at least 4 players in this category to create matches.</p>
                        </div>
                    ) : (
                        <Link to="create-matches">
                            <button
                                className="submit text-center"
                            >
                                Create matches
                            </button>
                        </Link>
                    )}
                </>
            )}
        </>
    )
} 