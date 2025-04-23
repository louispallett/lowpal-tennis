import axios from "axios";
import { useState } from "react"
import { useParams } from "react-router-dom";
import { Dialog } from '@headlessui/react';
import { useForm } from "react-hook-form";

import Loader from "../Auxiliary/Loader";

export default function GenerateMatches() {
    const { tournamentId, categoryId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const generateMatches = () => {
        setIsOpen(true);
        axios.post("/api/match/generate", {
            tournamentId,
            categoryId
        }).then((response) => {
            setData(response.data);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <div className="flex flex-col gap-2.5">
            <button
                className={data ? "hidden" :"submit text-center"}
                onClick={generateMatches}
            >
                Generate matches
            </button>
            { isOpen && (
                <div className="standard-container bg-slate-100">
                    { loading && (
                        <div className="flex justify-center">
                            <Loader />
                        </div>
                    )}
                    { error && (
                        <></>
                    )}
                    {data && (
                        <MatchesList matches={data.matches} totalRounds={data.totalRounds} />
                    )}
                </div>
            )}
        </div>
    )
}

function MatchesList({ matches, totalRounds }) {
    const { tournamentId, categoryId } = useParams();

    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const groupByRound = () => {
        const groups = Array.from({ length: totalRounds }, () => []);

        matches.forEach(obj => {
            const roundIndex = obj.tournamentRoundText - 1;
            groups[roundIndex].push(obj);
        });
        return groups;
    }
    const matchesByRound = groupByRound();

    const onSubmit = async (data) => {
        setIsPending(true);
        axios.post("/api/match/create", {
            data, matches, tournamentId, categoryId, totalRounds
        }).then((response) => {
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setIsPending(false);
        })
    }

    return (
        <>
            <h4 className="mb-2.5">Generated Matches</h4>
            <h5>Seeding</h5>
            <p>
                Please find below your generated matches. Note that these matches are <i>not</i> created randomly, but 
                through a process known as <a className="text-click" href="https://en.wikipedia.org/wiki/Seeding_(sports)">seeding</a>.
                "Standard Seeding" ensures that the top two ranked players cannot meet each other until the finals, the top four players
                until the semi-finals, the top eight players until the quarter finals, and so on.
            </p>
            <p>Therefore, if the rankings stay consistant, the generated matches will always be the same.</p>
            <h5 className="my-2.5">Adding Round deadlines</h5>
            <p>
                Below you will see the matches listed by round. You'll be asked to add a deadline for each round - this will be displayed to the 
                to the players of each match.
            </p>
            <p className="mt-2.5 text-center text-red-800">Make sure you save and submit, otherwise the matches won't be saved!</p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                { matchesByRound.map((round) => (
                    <Rounds round={round} totalRounds={totalRounds} key={round[0].tournamentRoundText} 
                        register={register}
                    />
                ))}
                { isPending ? (
                    <button className="submit cursor-wait flex justify-center">
                        <div className="spinner h-6 w-6"></div>
                    </button>
                ) : (
                    <>
                        { success ? (
                            <button className="success flex justify-center items-center gap-2.5"
                            >
                                <b>Success! Please wait...</b>
                                <div className="spinner w-4 h-4"></div>
                            </button>
                        ) : (
                            <button
                                className="submit text-center"
                                type="submit"
                            >
                                Save and Submit
                            </button>
                        )}
                    </>
                )}
            </form>
        </>
    )
}

function Rounds({ round, totalRounds, register }) {
    let roundNumber;
    const roundDiff = totalRounds - round[0].tournamentRoundText;
    
    switch (roundDiff) {
        case 0:
            roundNumber = "Final";
            break;
        case 1:
            roundNumber = "Semi-Finals";
            break;
        case 2:
            roundNumber = "Quarter-Finals";
            break;
        default:
            roundNumber = `Round ${round[0].tournamentRoundText}`;
    }

    return (
        <div className="standard-container shadow-none text-center bg-lime-200 flex flex-col my-5">
            <h5><i>{roundNumber}</i></h5>
            { round[0].qualifyingMatch && (
                <p className="standard-container bg-indigo-600 text-white shadow-none">This is a qualifying round</p>
            )}
            { round.map((match) => (
                <MatchCard match={match} />
            ))}
            <div className="standard-container self-end shadow-none bg-indigo-200 max-w-2xl flex-col flex">
                <label className="text-right">Deadline for {roundNumber}</label>
                <input
                    type="date" className="p-2.5 rounded-md"
                    {...register (`${round[0].tournamentRoundText}`, {
                        required: "Deadline is required"
                    })}
                />
            </div>
        </div>
    )
}

function MatchCard({ match }) {
    return (
        <div className="flex items-center my-2.5 gap-2.5">
            <div className="standard-container shadow-none bg-slate-100">
                { match.participants.length > 0 ? (
                    <p>{match.participants[0].name}</p>
                ) : (
                    <p>TBC</p>
                )} 
            </div>
            <p>vs.</p>
            <div className="standard-container shadow-none bg-slate-100">
                { match.participants.length > 1 ? (
                    <p>{match.participants[1].name}</p>
                ) : (
                    <p>TBC</p>
                )} 
            </div>
        </div>
    )
}
