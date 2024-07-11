import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ChevronDownIcon, CalendarIcon, CursorArrowRippleIcon, TagIcon } from "@heroicons/react/16/solid";
import { Spinner } from "./tailwind_components/tailwind-ex-elements";


export default function Match() {
    const { matchId } = useParams();
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMatch = async () => {
            try {
                const response = await fetch(`/api/match/${matchId}`, { mode: "cors" });
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
        <div className="flex flex-1 justify-center items-center">
            <div className="grid grid-row-2 my-5 lg:my-0 gap-2.5">
                <div className="flex flex-col justify-start gap-2.5 lg:flex-row md:gap-5 flex-1">
                    <MatchCard matchData={matchData} loading={loading} />
                    <PlayerContactDetails matchId={matchId} />
                </div>
                <MatchForm matchData={matchData} loading={loading} />
            </div>
        </div>
    )
}

function MatchCard({ matchData, loading }) {
    return (
        <>
            { loading && (
                <div className="flex justify-center m-10 items-center p-20 bg-slate-300 rounded-lg shadow dark:bg-slate-700">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-indigo-500 animate-spin dark:text-gray-600 fill-lime-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            { matchData && (
                <>
                    <div className="flex flex-col gap-1.5 mx-1.5">
                        <div>
                            <div className="flex flex-col bg-lime-600 rounded-lg rounded-b-none shadow text-sm px-10 lg:text-base dark:bg-slate-700">
                                <h5 className="p-3 text-xl tracking-tight text-slate-100 text-center sm:text-2xl sm:p-5">Match Details</h5>
                            </div>
                            <div className="flex flex-col p-2.5 bg-white rounded-lg rounded-t-none shadow text-sm lg:text-base dark:bg-slate-700">
                                <div className="grid grid-cols-3 items-center px-2.5 py-1.5 font-semi-bold text-center dark:text-slate-100 sm:px-4 sm:py-3.5">
                                    <p>{matchData.participants[0].name}</p>
                                    <p className="text-lg font-black"><i>vs</i></p>
                                    <p>{matchData.participants[1] ? matchData.participants[1].name : "TBC"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white rounded-lg shadow text-sm px-5 sm:text-base dark:bg-slate-700 py-2.5 sm:py-5">
                            <TagIcon className="sm:block h-4 w-4" />
                            <p className="tracking-tight dark:text-slate-200"><b>Category</b>: {matchData.category.name}</p>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white rounded-lg shadow text-sm px-5 sm:text-base dark:bg-slate-700 py-2.5 sm:py-5">
                            <CursorArrowRippleIcon className="sm:block h-4 w-4" />
                            <p>State:&nbsp; <b className="text-green-400">{matchData.state}</b></p>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white rounded-lg shadow text-sm px-5 sm:text-base dark:bg-slate-700 py-2.5 sm:py-5">
                            <CalendarIcon className="sm:block h-4 w-4" />
                            <p>Deadline to play:&nbsp; <b className="text-red-600">25th August 2024</b></p>
                        </div>
                    </div>
                </>
            )}
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
                const response = await fetch(`/api/match/${matchId}/contactDetails`, { mode: "cors" });
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
        <div className="flex flex-col gap-1.5 mx-1.5">
            <div>
                <div className="flex flex-col bg-lime-600 rounded-lg rounded-b-none shadow text-sm px-10 lg:text-base dark:bg-slate-700">
                    <h5 className="p-3 text-xl tracking-tight text-slate-100 text-center sm:text-2xl sm:p-5">Contact Details</h5>
                </div>
                <div className="flex flex-col p-2.5 bg-white rounded-lg rounded-t-none shadow text-sm lg:text-base dark:bg-slate-700">
                    <div className="px-2.5 py-1.5 font-semi-bold dark:text-slate-100 sm:px-4 sm:py-3.5">
                        { loading && (
                            <div className="flex justify-center m-10 items-center py-10">
                                <div role="status">
                                    <svg aria-hidden="true" className="w-8 h-8 text-indigo-500 animate-spin dark:text-gray-600 fill-lime-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
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
        </div>
    )
}

function MatchForm({ matchData, loading }) {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = async (data) => {

    }

    return (
        <div className="flex flex-col gap-1.5 mx-1.5">
            <div>
                <div className="flex flex-col bg-lime-600 rounded-lg rounded-b-none shadow text-sm px-10 lg:text-base dark:bg-slate-700">
                    <h5 className="p-3 text-xl tracking-tight text-slate-100 text-center sm:text-2xl sm:p-5">Submit Results</h5>
                </div>
                <div className="flex flex-col p-2.5 bg-white rounded-lg rounded-t-none shadow text-sm lg:text-base dark:bg-slate-700">
                    <div className="px-2.5 py-1.5 font-semi-bold dark:text-slate-100 sm:px-4 sm:py-3.5">
                        { loading && (
                            <div className="flex justify-center m-10 items-center p-20 bg-slate-300 rounded-lg shadow dark:bg-slate-700">
                                <div role="status">
                                    <svg aria-hidden="true" className="w-8 h-8 text-indigo-500 animate-spin dark:text-gray-600 fill-lime-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        )}
                        { matchData && (
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5" noValidate>
                                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5">
                                    <div>
                                        <label htmlFor="gender" className="font-bold text-sm leading-6 dark:text-white">Who won?</label>
                                        <div className="relative">
                                            <select name="gender" id="gender" required
                                                className="appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white dark:bg-slate-700">
                                                <option value="">- - Winner - -</option>
                                                <option value="male">{matchData.participants[0].name}</option>
                                                <option value="female">{matchData.participants[1].name}</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <ChevronDownIcon className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="gender" className="font-bold text-sm leading-6 dark:text-white">Who won?</label>
                                        <div className="relative">
                                            <select name="gender" id="gender" required
                                                className="appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white dark:bg-slate-700">
                                                <option value="">- - Winner - -</option>
                                                <option value="male">{matchData.participants[0].name}</option>
                                                <option value="female">{matchData.participants[1].name}</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <ChevronDownIcon className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { isPending ? (
                                    <div className="flex justify-center">
                                        <Spinner id="spinner"/>
                                    </div>
                                ) : (
                                    <button type="submit" 
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >Submit Results</button>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}