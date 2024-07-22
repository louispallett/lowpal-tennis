import axios from "axios";
import React from "react";
import { Dialog } from '@headlessui/react'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ChevronDownIcon, CalendarIcon, CursorArrowRippleIcon, TagIcon } from "@heroicons/react/16/solid";
import tennisBall from "/assets/images/tennis-ball.svg";
import { Link } from "react-router-dom";


export default function Match() {
    const { matchId } = useParams();
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMatch = async () => {
            try {
                const response = await fetch(`https://lowpal-tennis-server.fly.dev/api/match/${matchId}`, { mode: "cors" });
                if (!response.ok) throw new Error(response.status);
                const actualData = await response.json();
                setMatchData(actualData.match);
                setError(null);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getMatch();
    }, []);
    
    return (
        <div className="flex flex-1 lg:my-2.5 justify-center items-center">
            { error ? (
                <div className="flex justify-center p-5 bg-slate-50 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                    <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                        <h5 className="text-xl font-sedan tracking-tight text-center lg:text-left sm:text-2xl sm:font-black">500 ERROR</h5>
                        <img src={tennisBall} alt="" className="h-10" id="spinner" />
                        <p>Oops! Looks like a server error. Please take a screenshot, note the time, and contact the administrator.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-row-2 my-5 lg:my-0 gap-2.5">
                    <div className="flex flex-col justify-between lg:flex-row lg:gap-5 flex-1">
                        <MatchCard matchData={matchData} loading={loading} />
                        <PlayerContactDetails matchId={matchId} />
                    </div>
                    <MatchForm matchData={matchData} loading={loading} />
                </div>
            )}
        </div>
    )
}

function MatchCard({ matchData, loading }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="flex flex-col gap-1.5 m-2.5">
                <div className="flex flex-col bg-lime-600 rounded-lg text-sm px-10 mb-2.5 shadow-[5px_5px_0px_0px_#4f46e5] lg:text-base">
                    <h5 className="p-3 text-xl tracking-tight text-slate-100 text-center sm:text-2xl sm:p-5">Match Details</h5>
                </div>
            { loading && (
                <div className="flex justify-center items-center p-20">
                    <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                        <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                    <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            { matchData && (
                <>
                    <div className="flex flex-col p-2.5 bg-white rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)] text-sm lg:text-base dark:bg-slate-700">
                        <div className="grid grid-cols-3 items-center px-2.5 py-1.5 font-semi-bold text-center dark:text-slate-100 sm:px-4 sm:py-3.5">
                            <p>{matchData.participants[0].name}</p>
                            <p className="text-lg font-black"><i>vs</i></p>
                            <p>{matchData.participants.length == 2 ? matchData.participants[1].name : "TBC"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white rounded-lg text-sm px-5 sm:text-base shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)] dark:bg-slate-700 py-2.5 sm:py-5">
                        <TagIcon className="h-4 w-4 dark:fill-white" />
                        <p className="tracking-tight dark:text-slate-100"><b>Category</b>: {matchData.category.name}</p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white rounded-lg shadow text-sm px-5 sm:text-base dark:bg-slate-700 py-2.5 sm:py-5 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                        <CursorArrowRippleIcon className="h-4 w-4 dark:fill-slate-100" />
                        { matchData.qualifyingMatch ? (<p className="dark:text-slate-100">This is a <button onClick={() => setIsOpen(true)} className="cursor-pointer text-slate-100 bg-indigo-600 p-1 px-2 rounded-md hover:bg-indigo-500 transition-all"><b>qualifying match</b></button></p>) : (<p className="dark:text-slate-100">State:&nbsp; <b className="text-green-400">{matchData.state}</b></p>)}
                        <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                                <Dialog.Panel as="div" className="max-w-lg space-y-4 p-12 bg-slate-100 rounded-lg shadow-[5px_5px_0px_0px_#4f46e5] dark:bg-slate-800 dark:text-slate-50">
                                    <h3 className="font-sedan">Qualifying Matches</h3>
                                    <p><b>A qualifying match is part of a first round which not everyone plays. If the number of players is not a power of 2 (2, 4, 8, 16, 32, etc.), some players will have to play a qualifying round to join the tournament.</b></p>
                                    <p><b>Other than not appearing on the tournament bracket, this is still an ordinary match!</b></p>
                                    <div className="flex gap-4">
                                    <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all" onClick={() => setIsOpen(false)}><b>Got it!</b></button>
                                    </div>
                                </Dialog.Panel>
                                </div>
                        </Dialog>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white rounded-lg shadow text-sm px-5 sm:text-base dark:bg-slate-700 py-2.5 sm:py-5 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                        <CalendarIcon className="h-4 w-4 dark:fill-white" />
                        <p className="dark:text-slate-100">Deadline to play:&nbsp; <b className="text-red-600">{matchData.startTime}</b></p>
                    </div>
                </>
            )}
            </div>
        </>
    )
}

function PlayerContactDetails({ matchId }) {
    const [contactData, setContactData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getContactDetails = async () => {
            try {
                const response = await fetch(`https://lowpal-tennis-server.fly.dev/api/match/${matchId}/contactDetails`, { mode: "cors" });
                if (!response.ok) throw new Error(response.status);
                const actualData = await response.json();
                setContactData(actualData.data);
                setError(null);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getContactDetails();
    }, []);

    return (
        <div className="flex flex-col gap-1.5 mx-1.5 lg:mt-2.5">
            <div className="flex flex-col bg-lime-600 rounded-lg text-sm px-10 mb-2.5 shadow-[5px_5px_0px_0px_#4f46e5] lg:text-base">
                <h5 className="p-3 text-xl tracking-tight text-slate-100 text-center sm:text-2xl sm:p-5">Contact Details</h5>
            </div>
            <div className="flex flex-col p-2.5 bg-white rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)] text-sm lg:text-base dark:bg-slate-700">
                <div className="px-2.5 py-1.5 font-semi-bold dark:text-slate-100 sm:px-4 sm:py-3.5">
                    { error && (
                        <div className="flex flex-col justify-center gap-5">
                            <img src={tennisBall} alt="" className="h-10" id="spinner" />
                            <p>Oops! Looks like a server error. Please take a screenshot, note the time, and contact the administrator.</p>
                        </div>
                    )}
                    { loading && (
                        <div className="flex justify-center items-center p-20">
                            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                    <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                        <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3.5 text-left">
                        { contactData && React.Children.toArray(contactData.map((item, index) => (
                            <>
                                <p>{item.name}</p>
                                <p>{item.mobile}</p>
                            </>
                        )))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MatchForm({ matchData, loading }) {
    const form = useForm();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [thirdSet, setThirdSet] = useState(false);
    const [error, setError] = useState(null);
    const [winner, setWinner] = useState('');
    const [scoresVisible, setScoresVisible] = useState(false);

    const handleWinnerChange = (event) => {
        const selectedWinner = event.target.value;
        setWinner(selectedWinner);
        setScoresVisible(selectedWinner !== "");
    };

    const handleThirdSet = () => setThirdSet(!thirdSet);

    const onSubmit = async (data) => {
        setIsPending(true);
        data.winner = winner;
        if (thirdSet) {
            data.team1Score = `${data.team1ScoreA}-${data.team1ScoreB}-${data.team1ScoreC}`;
            data.team2Score = `${data.team2ScoreA}-${data.team2ScoreB}-${data.team2ScoreC}`;
        } else {
            data.team1Score = `${data.team1ScoreA}-${data.team1ScoreB}`;
            data.team2Score = `${data.team2ScoreA}-${data.team2ScoreB}`;
        }

        try {
            const response = await axios.post(`https://lowpal-tennis-server.fly.dev/api/match/matches/${matchData._id}/update`, data);
            if (!response.data.msg) {
                setIsPending(false);
                setError(response.data.error);
                return;
            }
            setIsSubmitted(true);
        } catch (err) {
            console.log(err);
            setError(err);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 mx-1.5">
            <div className="flex flex-col bg-lime-600 rounded-lg text-sm px-10 mb-2.5 shadow-[5px_5px_0px_0px_#4f46e5] lg:text-base">
                <h5 className="p-3 text-xl tracking-tight text-slate-100 text-center sm:text-2xl sm:p-5">Submit Results</h5>
            </div>
            <div className="flex flex-col p-2.5 bg-white rounded-lg text-sm lg:text-base shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)] dark:bg-slate-700">
                <div className="px-2.5 py-1.5 font-semi-bold dark:text-slate-100 sm:px-4 sm:py-3.5">
                    {loading && (
                        <div className="flex justify-center items-center p-20">
                            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                    <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                        <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="text-center dark:text-slate-100">
                            <p>{error.message}</p>
                        </div>
                    )}
                    {isSubmitted ? (
                        <>
                            <div className="text-center dark:text-slate-100" id="fade-down">
                                <p>Thank you for submitting your match scores.</p>
                                <p>If you won, you'll find your next match back on your dashboard.</p>
                            </div>
                            <Link to="/dashboard" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 my-2.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">Return to dashboard</Link>
                        </>
                    ) : (
                        matchData && (
                            matchData.participants.length < 2 ? (
                                <div className="flex flex-col">
                                    <img src={tennisBall} className="h-10 my-2.5" id="spinner" alt="Loading" />
                                    <p className="text-center dark:text-slate-100"><b>Cannot submit scores yet.</b></p>
                                    <p className="text-center dark:text-slate-100">Please wait until both sides are ready. If you believe there is an error, please report it to the administrator.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5" noValidate>
                                    <div className="flex flex-col gap-2.5">
                                        <div>
                                            <label htmlFor="winner" className="font-bold text-sm leading-6 dark:text-white">Who won?</label>
                                            <div className="relative">
                                                <select name="winner" id="winner" required
                                                    value={winner} onChange={handleWinnerChange}
                                                    className="appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white dark:bg-slate-700">
                                                    <option value="">- - Winner - -</option>
                                                    <option value={matchData.participants[0].id}>{matchData.participants[0].name}</option>
                                                    <option value={matchData.participants[1].id}>{matchData.participants[1].name}</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <ChevronDownIcon className="h-4 w-4 md:h-6 md:w-6 dark:fill-slate-100" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={scoresVisible ? '' : 'hidden'}>
                                            <div className="flex items-center justify-center my-2.5 gap-2.5">
                                                <input type="checkbox" className="h-6" id="thirdSet" onClick={handleThirdSet} />
                                                <label htmlFor="thirdSet" name="thirdSet">Played a third set/match tie break</label>
                                            </div>
                                            <label htmlFor="scores" className="font-bold text-sm leading-6 dark:text-white">Scores</label>
                                            {thirdSet ? (
                                                <div className="grid grid-cols-4 grid-row-3 gap-1.5 text-sm items-center">
                                                    <p></p>
                                                    <p>Set 1</p>
                                                    <p>Set 2</p>
                                                    <p>Set 3/tie-break</p>
                                                    <p>{matchData.participants[0].name}</p>
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team1ScoreA", { required: "Please enter a value" })} />
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team1ScoreB", { required: "Please enter a value" })} />
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team1ScoreC", { required: "Please enter a value" })} />
                                                    <p>{matchData.participants[1].name}</p>
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team2ScoreA", { required: "Please enter a value" })} />
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team2ScoreB", { required: "Please enter a value" })} />
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team2ScoreC", { required: "Please enter a value" })} />
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 grid-row-3 gap-1.5 text-sm items-center">
                                                    <p></p>
                                                    <p>Set 1</p>
                                                    <p>Set 2</p>
                                                    <p>{matchData.participants[0].name}</p>
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team1ScoreA", { required: "Please enter a value" })} />
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team1ScoreB", { required: "Please enter a value" })} />
                                                    <p>{matchData.participants[1].name}</p>
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team2ScoreA", { required: "Please enter a value" })} />
                                                    <input min="0" max="8" className="max-w-16 self-start rounded-md py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"
                                                        {...register("team2ScoreB", { required: "Please enter a value" })} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {error && (
                                        <p className="text-red-500 text-center"><b>{error}</b></p>
                                    )}
                                    {isPending ? (
                                        <div className="flex justify-center">
                                            <img src={tennisBall} className="h-10 fill-slate-100" id="spinner" alt="Loading" />
                                        </div>
                                    ) : (
                                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">Submit Results</button>
                                    )}
                                </form>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
}