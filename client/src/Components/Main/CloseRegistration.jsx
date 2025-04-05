import axios from "axios"
import { Dialog } from '@headlessui/react';
import { useState } from "react"
import { useParams } from "react-router-dom";

import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/16/solid";

export default function CloseRegistration({ isOpen, setIsOpen }) {
    const {tournamentId} = useParams();
    const [submitted, setSubmitted] = useState(false);
    const [invalidatedData, setInValidatedData] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateTournament = () => {
        setLoading(true);
        axios.get("/api/tournaments/validate-tournament", { 
            headers: { tournamentId } 
        }).then((response) => {
            console.log(response.data);
            setInValidatedData(response.data.invalid);
            setSubmitted(true);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <Dialog as="div" open={isOpen != false ? true : false} onClose={() => setIsOpen(false)} className="relative z-50 m-0 p-0">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <Dialog.Panel className="form-input text-base bg-slate-50 sm:p-6 overflow-y-auto max-h-[90vh]">
                    <div className="flex flex-col gap-2.5">
                        <h3>Closing Registration</h3>
                        <p>In order to close registration, your tournament has to pass a few validation checks:</p>
                        <div>
                            <ValidationRequirement rule={"All doubles categories must have at least 8 players."} id={0} data={invalidatedData} submitted={submitted} loading={loading} />
                            <ValidationRequirement rule={"All doubles categories must have an even number of players."} id={1} data={invalidatedData} submitted={submitted} loading={loading} />
                            <ValidationRequirement rule={"All singles categories must have at least 4 players."} id={2} data={invalidatedData} submitted={submitted} loading={loading} />
                            <ValidationRequirement rule={"Mixed Doubles must have an equal number of male and female players"} id={3} data={invalidatedData} submitted={submitted} loading={loading} />
                        </div>
                        { invalidatedData.length > 0 && (
                            <div>
                                <p className="text-red-600">Failed one or more validation checks? You can manage the players for each individual category to remove any if necessary.</p>
                                <p className="text-red-600">If you are no longer able to get the minimum number of players, you can cancel and delete a category on the category page.</p>
                            </div>
                        )}
                        <div className="flex gap-2.5">
                            <div className="w-full">
                                { loading ? (
                                    <button className="submit cursor-wait flex justify-center">
                                        <div className="spinner h-6 w-6"></div>
                                    </button>
                                ) : (
                                    <>
                                        { submitted ? (
                                            <>
                                                { invalidatedData.length < 1 ? (
                                                    <button className="submit hover:bg-lime-500">
                                                        <b>Close Tournament</b>
                                                    </button>
                                                ) : (
                                                    <button className="submit hover:bg-lime-500"
                                                        onClick={validateTournament} 
                                                    >
                                                        <b>Validate</b>
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <button className="submit hover:bg-lime-500"
                                                onClick={validateTournament} 
                                            >
                                                <b>Validate</b>
                                            </button>
                                        )}
                                    </>
                                )}

                            </div>
                             <button className="submit hover:bg-lime-500" onClick={() => setIsOpen(false)}>
                                <b>Close</b>
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

function ValidationRequirement({ rule, id, data, submitted, loading }) {
    const invalid = data.includes(id);
    return (
        <div className="flex gap-2.5 justify-center">
            <p>&gt; {rule}</p>
            <div>
                { loading && (
                    <div className="spinner w-4 h-4"></div>
                )}
                { submitted && (
                    <>
                        { invalid ? (
                            <XCircleIcon className="w-6 text-red-600" />
                        ) : (
                            <CheckBadgeIcon className="w-6 text-lime-600" />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}