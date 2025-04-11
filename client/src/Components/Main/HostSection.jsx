import { useState } from "react"
import { Link, useParams } from "react-router-dom";

import CloseRegistration from "./CloseRegistration.jsx";
import errorSVG from "/assets/images/error.svg";
import Loader from "../Auxiliary/Loader";
import axios from "axios";
import { useForm } from "react-hook-form";


export default function HostSection({ data }) {
    // If matches have already been created for a match, category.locked will be TRUE, so filter these out
    const openCategories = data.categories.filter(category => !category.locked);
    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5">
            <h3>Host Section</h3>
            <p>Hi {data.firstName}! Welcome to your host section. Here you can make unique operations and changes to the tournament reserved only for you (as host).</p>
            <TournamentStage stage={data.tournament.stage} openCategoriesLength={openCategories.length} />
            { openCategories.length > 0 && (
                <>
                    <h4 className="text-center mt-4">Categories</h4>
                    <p>
                        Below you'll see each category for your tournament. You can click on each individual category to find out information about the category and create the matches
                        for each category in your tournament.
                    </p>
                    <div className="tournament-grid-sm">
                        { openCategories.map(item => (
                            <CategoryFunctions data={item} key={item._id} />
                        ))}
                    </div>
                </>
            )}
            <RankPlayers />
            {/* { data.tournament.stage === "finished" && (
                <div className="tournament-grid-sm">
                    { openCategories.map(item => (
                        <CategoryFunctions data={item} key={item._id} />
                    ))}
                </div>
            )} */}
            {/* { data.tournament.stage === "sign-up" || data.tournament.stage === "play" && (
                <EditSettings data={data}/>
            )} */}
        </div>
    )
}

function TournamentStage({ stage, openCategoriesLength }) {
    const [isCloseRegOpen, setIsCloseRegOpen] = useState(false);
    const [isFinishOpen, setIsFinishOpen] = useState(false);

    return (
        <div className="form-input bg-indigo-600 text-white">
            { stage === "sign-up" && (
                <>
                    <h4>Stage: Sign-Up</h4>
                    <h5 className="text-center">Closing registration</h5>
                    <p>
                        Currently, the tournament is in it's 'sign-up' stage, meaning users with the right code can join. Once you wish to close registration, click the
                        button below. Then you can use our tool to create the teams and matches.
                    </p>
                    <button
                        className="submit text-center"
                        onClick={() => setIsCloseRegOpen(true)}
                    >
                        Close registration
                    </button>
                    <CloseRegistration isOpen={isCloseRegOpen} setIsOpen={setIsCloseRegOpen} />
                </>
            )}
            { stage === "play" && (
                <div className="flex flex-col gap-2.5">
                    <h4>Stage: Play</h4>
                    { openCategoriesLength > 0 ? (
                        <>
                            <h5 className="text-center italic">Creating Teams and/or Matches</h5>
                            <p>
                                The tournament is currently in the 'play' stage, however you still have categories below which require team and/or match creation.
                                To create the necessary matches/teams, click on a category below and follow the directions on the page.
                            </p>
                            <p>
                                Once you create the matches for a category, it will be locked, and you won't able to access this page again.
                            </p>
                        </>
                    ) : (
                        <>
                            <h5 className="text-center italic">Time to play!</h5>
                            <p> You've created matches for all the categories in your tournament. Now all that's left is for your players to play their matches!</p>
                            <button
                                className="submit bg-lime-600 text-center"
                                onClick={() => setIsFinishOpen(true)}
                            >
                                Finish Tournament
                            </button>
                            <CloseRegistration isOpen={isFinishOpen} setIsOpen={setIsFinishOpen} />
                        </>
                    )}
                </div>
            )}
            { stage === "finished" && (
                <>
                    <h4>Stage: Finished</h4>
                    <p>Thank you for using <i>LowPal Tennis</i>!</p>
                </>
            )}
        </div>
    )
}

function CategoryFunctions({ data, key }) {
    return (
            <Link to={"category/" + data._id}>
                <button
                    className="submit"
                >
                    {data.name}
                </button>
            </Link>
    )
}

function RankPlayers() {
    const { tournamentId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [players, setPlayers] = useState(null);

    const form = useForm();
    const { register, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [success, setSuccess] = useState(false);

    const openRankingPlayers = () => {
        setLoading(true);
        setIsOpen(true);
        axios.get("/api/players/get-player-rankings", {
            headers: {
                tournamentId
            }
        }).then((response) => {
            const maleSeeded = response.data.players.filter(player => player.male && player.seeded);
            const maleNonSeeded = response.data.players.filter(player => player.male && !player.seeded);
            const femaleSeeded = response.data.players.filter(player => !player.male && player.seeded);
            const femaleNonSeeded = response.data.players.filter(player => !player.male && !player.seeded);

            setPlayers({ maleSeeded, maleNonSeeded, femaleSeeded, femaleNonSeeded });
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    const onSubmit = async (data) => {
        setIsPending(true);

        axios.post("/api/players/update-player-rankings", data)
        .then(response => {
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 1500)
        }).catch(err => {
            console.log(err);
            setError(err);
        }).finally(() => {
            setIsPending(false);
        })
    }

    return (
        <div className="flex flex-col gap-2.5 my-5">
            <h4 className="text-center">Ranking Players</h4>
            <p>You can set each players rankings by clicking on the button below. You'll want to rank males and females seperately (i.e. there can be a 'rank 1' male and a 'rank 1' female, but not two rank 1 males).</p>
            <p>
                Ranking allows the programme to generate 'strategic tournament bracket'. This means that the top two players will be assigned to matches so that they can both reach the final <i>without playing each other before</i>. Similarly, 
                the top four players won't meet each other until the semi-finals, the top eight until the quarter-finals, and so on.
            </p>
            <p>
                If you're only organising a small tournament of, for example, 4-6 players (or teams for doubles) in each category, this may not be necessary. However, it is recommended for larger tournaments, otherwise you may face a situation where
                the top ranking player plays the next three ranked players before reaching the final, and then plays the fifth ranked player... which may not result in a particularly satisfying final (since the rank 1 player is likely to win)!
            </p>
            <button
                className="submit text-center"
                onClick={openRankingPlayers}
            >
                Rank Players
            </button>
            { isOpen && (
                <div className="form-input p-2.5 flex flex-col justify-center items-center">
                    { loading && (
                            <Loader />                    
                        )}
                    { players && (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <h4>Players</h4>
                            <div className="flex flex-col lg:grid grid-cols-2 gap-10">
                                <div className="flex flex-col gap-2.5">
                                    {/* Male Players */}
                                    <h4>Male Players</h4>
                                    { players.maleSeeded.length > 0 && (
                                        <>
                                            <p><i>Seeded</i></p>
                                            { players.maleSeeded.map(item => (
                                                <PlayerRankCard data={item} key={item._id} register={register} reg={item._id}/>
                                            ))}
                                            <hr />
                                        </>
                                    )}
                                    { players.maleNonSeeded.length > 0 && (
                                        <>
                                            <p><i>Non-Seeded</i></p>
                                            { players.maleNonSeeded.map(item => (
                                                <PlayerRankCard data={item} key={item._id} register={register} reg={item._id} />
                                            ))}
                                        </>
                                    )}  
                                </div>
                                <div className="flex flex-col gap-2.5 text-right">
                                    {/* Female Players */}
                                    <h4>Female Players</h4>
                                    { players.femaleSeeded.length > 0 && (
                                        <>
                                            <p><i>Seeded</i></p>
                                            { players.femaleSeeded.map(item => (
                                                <PlayerRankCard data={item} key={item._id} register={register} reg={item._id} />
                                            ))}
                                            <hr />                                      
                                        </>
                                    )}
                                    { players.femaleNonSeeded.length > 0 && (
                                        <>
                                            <p><i>Non-Seeded</i></p>
                                            { players.femaleNonSeeded.map(item => (
                                                <PlayerRankCard data={item} key={item._id} register={register} reg={item._id} />
                                            ))}                                        
                                        </>
                                    )}
                                </div>
                            </div>
                            { success ? (
                                <div 
                                    className="success flex justify-center my-2.5"
                                >
                                    Success!
                                </div>
                            ) : (
                                <button 
                                    className="submit flex justify-center my-2.5"
                                    type="submit"
                                >
                                    {isPending ? (
                                        <div className="spinner h-6 w-6"></div>
                                    ) : (
                                        <>
                                            Submit
                                        </>
                                    )}
                                </button>
                            )}
                        </form>
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
                </div>
            )}
        </div>
    )
}

function PlayerRankCard({ data, key, register, reg }) {
    return (
        <div className="form-input p-2 flex flex-1 justify-between shadow-none items-center gap-2.5">
            <p className="text-left">{data.user["name-long"]}</p>
            <input type="number" className="form-input p-2 max-w-24 shadow-none"
                required
                id={reg}
                defaultValue={data.ranking}
                {...register(reg, {
                    required: "Is required",
                    min: {
                        value: 0,
                        message: "Must be a positive integer"
                    }
                })}
            />
        </div>
    )
}