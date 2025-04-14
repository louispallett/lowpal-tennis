import axios from "axios"
import { Dialog } from '@headlessui/react';
import { useState } from "react"
import { useParams } from "react-router-dom";


export default function ReOpenRegistration({ isOpen, setIsOpen }) {
    const { tournamentId } = useParams();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    
    return (
        <Dialog as="div" open={isOpen != false ? true : false} onClose={() => setIsOpen(false)} className="relative z-50 m-0 p-0">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <Dialog.Panel className="form-input text-base bg-slate-50 sm:p-6 overflow-y-auto max-h-[90vh] max-w-6xl">
                    <div>
                        <h3>Re-Opening Registration</h3>
                        <div className="flex flex-col my-5 gap-1.5">
                            <p>You can re-open registration as long as you haven't created any matches or tournaments yet.</p>
                            <p>
                                This will set the stage of the tournament back to 'sign-up' and users will then be able to sign-up normally using the tournament code. 
                                When ready, you can then close the tournament again. However, please note that your tournament will need to pass the same validation checks as before.
                            </p>
                            <p>As a reminder, these are:</p>
                            <div className="mt-2.5 ml-5">
                                <p>&gt; All doubles categories must have at least 8 players.</p>
                                <p>&gt; All doubles categories must have an even number of players.</p>
                                <p>&gt; All singles categories must have at least 4 players.</p>
                                <p>&gt; Mixed Doubles must have an equal number of male and female players</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2.5">
                            <div className="w-full">
                                { loading ? (
                                    <button className="submit cursor-wait flex justify-center">
                                        <div className="spinner h-6 w-6"></div>
                                    </button>
                                ) : (
                                    <ReOpenRegistrationButton />
                                )}

                            </div>
                             <button className="submit" onClick={() => setIsOpen(false)}>
                                <b>Close</b>
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

function ReOpenRegistrationButton() {
    const { tournamentId } = useParams();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCloseRegistration = (() => {
        setLoading(true);
        axios.put("/api/tournaments/update-tournament-stage", {
            tournamentId,
            stage: "sign-up"
        }).then(() => {
            console.log("Success");
            setSuccess(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        }).catch((err) => {
            console.error('Error updating tournament stage:', err);
        }).finally(() => {
            setLoading(false);
        })
    });

    return (
        <>
            { loading ? (
                <button className="submit cursor-wait flex justify-center">
                    <div className="spinner h-6 w-6"></div>
                </button>
            ) : (
                <>
                    { error ? (
                        <p>Error</p>
                    ) : (
                        <>
                            { success ? (
                                <button className="success flex justify-center items-center gap-2.5"
                                >
                                    <b>Success! Please wait...</b>
                                    <div className="spinner w-4 h-4"></div>
                                </button>
                            ) : (
                                <button className="submit"
                                    onClick={handleCloseRegistration}
                                >
                                    <b>Re-Open Registration</b>
                                </button>
                            )}
                        </>
                    )}
                </>
            ) }
        </>
    )
}