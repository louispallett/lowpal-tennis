import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

import tennisBall from "/assets/images/tennis-ball.svg";

export default function Category() {
    const [data, setData] = useState(null);
    const { categoryId } = useParams();
    useEffect(() => {
        const getCategoryDetails = () => {
            axios.get("/api/categories/get-category-detail", {
                headers: {
                    categoryId
                }}
            ).then((response) => {
                console.log(response.data);
                setData(response.data);
            }).catch((err) => {
                console.log(err);
            })
        }
        getCategoryDetails();
    }, [])
    return (
        <div className="flex flex-col gap-5 mx-5">
            { data ? (
                <>
                    <div className="form-input bg-lime-400">
                        <h3>{data.category.name}</h3>
                    </div>
                    <CategoryInfo data={data} />
                    <Actions data={data} />
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

function CategoryInfo({ data }) {
    const noOfMales = data.players.filter(player => player.male).length;
    const seeded = data.players.filter(player => player.seeded).length;

    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5">
            <h3>Category Information</h3>
            <div className="tournament-grid-sm">
                <p className="form-input">Number of players: {data.players.length}</p>
                <p className="form-input">Number of active matches: {data.matches.filter(match => match.state === "SCHEDULED").length}</p>
                <p className="form-input">Males: {noOfMales}</p>
                <p className="form-input">Females: {data.players.length - noOfMales}</p>
                <p className="form-input">Seeded: {seeded}</p>
                <p className="form-input">Non-Seeded: {data.players.length - seeded}</p>
            </div>
            <div className="form-input bg-indigo-500">
                <h4 className="text-white">Players</h4>
                { data.players.length < 1 ? (
                    <div className="form-input bg-slate-100 flex gap-2.5 justify-center items-center">
                        <img src={tennisBall} className="h-16" id="spinner" alt="" />
                        <h4>No players yet!</h4>
                    </div>
                ) : (
                    <div className="tournament-grid-sm">
                        { data.players.map((player) => (
                            <div className="form-input bg-slate-100">
                                <p>{player.user.firstName} {player.user.lastName}</p>
                                <p>Gender: {player.male ? "male" : "female"}</p>
                                <p>Seeded: {player.seeded ? "true" : "false"}</p>
                                <p>Ranking: {player.ranking === 0 ? "Not assigned" : player.ranking}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function Actions({ data }) {
    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5">
            <h3>Category Operations</h3>
            { data.category.tournament.stage === "finished" ? (
                <p>Finished</p>
            ) : (
                <>
                    { data.category.tournament.stage === "sign-up" && !data.category.locked ? (
                        <>
                            <h4>Creating Matches</h4>
                            <p>
                                Now that registration for this tournament is closed, you can create the matches and teams. You will only be able to create teams if this 
                                is a doubles category.
                            </p>
                            <div className="flex gap-2.5">
                                { data.category.doubles && (
                                    <div className="flex items-center gap-2.5">
                                        <CreateTeam data={data} />
                                        <p className="w-64"> -&gt; and then -&gt;</p>
                                    </div>
                                )}
                                <CreateMatches data={data} />
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

function CreateTeam({ data }) {
    return (
        <button
            className="submit text-center"
        >
            Create teams
        </button>
    )
}

function CreateMatches({ data }) {
    return (
        <button
            className="submit text-center"
        >
            Create matches
        </button>
    )
} 