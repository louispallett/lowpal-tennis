"use client"

import { MatchType, UserType } from "@/lib/types"
import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import NoInfo from "./NoInfo"

type UserMatchesProps = { 
    userMatches:MatchType[],
    stage:string
}


export default function UserMatches({ userMatches, stage }:UserMatchesProps) {
    const [isOpen, setIsOpen] = useState<MatchType | null>(null);
    const matchInfoRef = useRef<HTMLDivElement | null>(null); 
    
    useEffect(() => {
        if (isOpen && matchInfoRef.current) {
            matchInfoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [isOpen]);

    return (
        <div className="standard-container container-indigo flex flex-col gap-2.5 z-0">
            <h3>Your Upcoming Matches</h3>
            { (stage === "play" || stage === "finished") ? (
                <>
                    {userMatches?.length > 0 ? (
                        <>
                            <p>These are your next upcoming matches. Click on each one to find out more information and submit scores.</p>
                            <div className="tournament-grid-sm">
                                {userMatches.map(item => (
                                    <MatchCard setIsOpen={setIsOpen} data={item} key={item._id} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <NoInfo text="No upcoming matches" />
                    )}
                </>                
            ) : (
                <NoInfo text="Matches will appear here when your host completes the draw" />
            )}

            {isOpen && (
                <div ref={matchInfoRef}>
                    <MatchInfo data={isOpen} setIsOpen={setIsOpen} />
                </div>
            )}
        </div>
    );
}


type MatchCardProps = {
    setIsOpen:any
    data:MatchType
}

function MatchCard({ setIsOpen, data }:MatchCardProps) {
    return (
        <div className="standard-container-no-shadow bg-indigo-600/90 max-w-4xl hover:bg-indigo-500 cursor-pointer"
            onClick={() => setIsOpen(data)}
        >
            <h5 className="standard-container-no-shadow mb-2.5 text-center bg-lime-400 shadow-none">{data.category.name}</h5>
            <div className="flex justify-between flex-col lg:flex-row items-center gap-2.5">
                <p className="standard-container-no-shadow bg-slate-100 shadow-none">{data.participants.length > 0 ? data.participants[0].name : "TBC"}</p>
                <p className="text-white">vs</p>
                <p className="standard-container-no-shadow bg-slate-100 shadow-none">{data.participants.length > 1 ? data.participants[1].name : "TBC"}</p>
            </div>
            <div className="flex gap-2.5">
                <p className="standard-container-no-shadow bg-slate-100 shadow-none mt-2.5">Deadline: {data.deadline}</p>
                <p className="standard-container-no-shadow bg-slate-100 shadow-none mt-2.5">Round: {data.tournamentRoundText}</p>
            </div>
        </div>
    )
}

type MatchInfoProps = { data: MatchType };

function MatchInfo({ data, setIsOpen }:MatchCardProps) {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState(null);
    const singles = data.category.name === "Men's Singles" || data.category.name === "Women's Singles";
    
useEffect(() => {
    const getUserInfo = async () => {
        const players = [];

        for (const participant of data.participants) {
            try {
                if (singles) {
                    const response = await axios.get(`/api/auth/player/${participant.participantId}`);
                    players.push(response.data);
                } else {
                    const response = await axios.get(`/api/auth/team/${participant.participantId}`);
                    players.push(...response.data);
                }
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        }
        setUsers(players);
    };

    getUserInfo();
}, [data]);

    return (
        <div className="standard-container-no-shadow">
            <h4 className="standard-container-no-shadow mb-2.5 text-center bg-lime-400">{data.category.name}</h4>
            <div className="flex flex-col lg:grid grid-cols-2 gap-2.5">
                <div className="standard-container-no-shadow flex flex-col sm:grid grid-cols-2 gap-2.5 self-start items-start bg-indigo-600/90">
                    { data.qualifyingMatch && (
                        <p className="standard-container-no-shadow bg-slate-50/90">Qualifying Match</p>
                    )}
                    <p className="standard-container-no-shadow bg-slate-50/90">Round: {data.tournamentRoundText}</p>
                    <p className="standard-container-no-shadow bg-slate-50/90">Deadline: {data.deadline}</p>
                </div>
                <div className="standard-container-no-shadow bg-indigo-600/90">
                    <h5 className="text-white">Contact Details</h5>
                    { users && (
                        <div>
                            { users.map(player => (
                                <ContactDetails user={player} key={player._id}/>
                            ))}
                        </div>
                    )}
                    { loading && (
                        <div className="flex justify-center items-center">
                            <div className="spinner h-6 w-6"></div>
                        </div>
                    )}
                </div>
            </div>
            <div className="standard-container-no-shadow mt-2.5 flex flex-col gap-2.5 bg-indigo-600/90">
                <h4 className="text-slate-50">Submit Results</h4>
                { data.participants.length > 1 ? (
                    <SubmitResultsForm info={data} />
                ) : (
                    <p className="text-slate-50">Please wait for all players to join this match before submitting results.</p>
                )}
            </div>
            <button className="submit mt-2.5"
                onClick={() => setIsOpen(false)}
            >Close</button>
        </div>
    )
}

type ContactDetailsProps = { user:UserType };

function ContactDetails({ user }:ContactDetailsProps) {
    return (
        <div className="grid grid-cols-2 gap-2.5 standard-container-no-shadow bg-slate-50/90 my-1">
            <p>{user["name-long"]}</p>
            <p>{user.mobCode} {user.mobile}</p>
        </div>
    )
}

function SubmitResultsForm({ info }:MatchInfoProps) {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [error, setError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const [checkedState, setCheckedState] = useState({ walkover: false });

    const player1Id = info.participants[0]._id;
    const player2Id = info.participants[1]._id;

    const [winner, setwinner] = useState("");

    const handleWinnerChange = (event:Event) => setwinner(event.target.value);

    const [scores, setScores] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        const player1Id = info.participants[0]._id;
        const player2Id = info.participants[1]._id;

        setScores({
            [player1Id]: [""],
            [player2Id]: [""],
        });
    }, [info]);
    
    const addSet = () => {
        if (scores[player1Id].length < 5) {
            setScores(prev => ({
                [player1Id]: [...prev[player1Id], ""],
                [player2Id]: [...prev[player2Id], ""],
            }));
        }
    };

    const removeSet = () => {
        if (scores[player1Id].length > 1) {
            setScores(prev => ({
                [player1Id]: prev[player1Id].slice(0, -1),
                [player2Id]: prev[player2Id].slice(0, -1),
            }));
        }
    };

    const handleCheckboxChange = (option:string) => {
        setCheckedState((prevState) => ({
            ...prevState,
            [option]: !prevState[option],
        }));
    };

    const onSubmit = async (data:any) => {
        setError("");

        if (!winner) {
            setError("You must select a winner");
            return;
        }

        if ((!scores[player1Id][0] || !scores[player2Id][0]) && !checkedState.walkover) {
            setError("You must give a score or a walkover");
            return;
        }

        data.winner = winner;
        data.scores = checkedState.walkover ? {  } : scores; 
        setIsPending(true);
        axios.put(`/api/match/${info._id}`, {
            data
        }).then(() => {
            setSuccess(true);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }).catch((err:any) => {
            console.log(err);
            setError(err.response.statusText);
        }).finally(() => {
            setIsPending(false);
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col md:flex-row gap-2.5">
                <div className="w-full shadow-none! relative">
                    <select name="winner" id="winner" required value={winner} onChange={handleWinnerChange}
                        className="form-input shadow-none!"
                    >
                        <option value="">- &gt; Winner &lt; -</option>
                        <option value={info.participants[0]._id}>{info.participants[0].name}</option>
                        <option value={info.participants[1]._id}>{info.participants[1].name}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                        <ChevronDownIcon className="h-6 w-6" />
                    </div>
                </div>
                <label className={`tournament-button shadow-none! ${checkedState.walkover ? "checked" : ""}`}>
                    <p>Walkover?</p>
                    <input
                        type="checkbox"
                        className="checkbox"
                        onChange={() => handleCheckboxChange("walkover")}
                    />
                    <span className="custom-checkbox"></span>
                </label>
            </div>
            { !checkedState.walkover && (
                <div className="mt-2.5 flex flex-col gap-2.5">
                    <h5 className="text-slate-50">Scores</h5>
                    <div className="flex items-center gap-2.5 standard-container-no-shadow bg-slate-50/90">
                        <p className="w-96">{info.participants[0].name}</p>
                        <div className="flex">
                            {scores[player1Id]?.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="border-2 p-1 w-9 rounded-sm text-center"
                                    value={value}
                                    onChange={(e) => {
                                        const newScores = [...scores[player1Id]];
                                        newScores[index] = e.target.value;
                                        setScores(prev => ({ ...prev, [player1Id]: newScores }));
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 standard-container-no-shadow bg-slate-50/90">
                        <p className="w-96">{info.participants[1].name}</p>
                        <div className="flex">
                            {scores[player2Id]?.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="border-2 p-1 w-9 rounded-sm text-center"
                                    value={value}
                                    onChange={(e) => {
                                        const newScores = [...scores[player2Id]];
                                        newScores[index] = e.target.value;
                                        setScores(prev => ({ ...prev, [player2Id]: newScores }));
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row self-end md:self-auto gap-2.5 mt-2.5">
                        <button type="button" onClick={addSet} className="success max-w-48 shadow-none!">+ Add Set</button>
                        <button type="button" onClick={removeSet} className="danger max-w-48 shadow-none!">- Remove Set</button>
                    </div>
                </div>
            )}
            <div className="mt-2.5">
                { isPending ? (
                    <div className="success flex justify-center items-center">
                        <div className="spinner h-6 w-6"></div>
                    </div>
                ) : (
                    <>
                        { success ? (
                            <div className="success">Success! Please wait...</div>
                        ) : (
                            <button className="success">Submit</button>
                        )}
                    </>
                )}
                { error && (
                    <p className="standard-container bg-red-500 mt-2.5">{error}</p>
                )}
            </div>
        </form>
    )
}