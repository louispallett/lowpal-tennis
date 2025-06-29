"use client"

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import JoinTournamentForm from "./JoinTournamentForm";

export default function CheckCode() {
    const [validCode, setValidCode] = useState(false);

    return (
        <>
            {validCode ? (
                <JoinTournamentForm validTournament={validCode} />
            ) : (
                <SignUpCode setValidCode={setValidCode}/>
            )}
        </>
    )
}

function SignUpCode({ setValidCode }: { setValidCode:any }) {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data:any) => {
        setIsPending(true);
        axios.get(`/api/tournament/check-code/${data.code}`)
            .then((response) => {
                setError(null);
                console.log(response.data);
                setValidCode(response.data);
            }).catch((err:any) => {
                setError(err.response.data.message);
            }).finally(() => {
                setIsPending(false);
            });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            <div className="relative w-full h-full flex flex-col gap-2.5">
                <input type="text" className="form-input" placeholder="Tournament Code"
                    {...register ("code", {
                        required: "Tournament code is required",
                    })}
                />
                { isPending ? (
                    <div className="submit flex justify-center items-center">
                        <div className="spinner h-6 w-6"></div>
                    </div>
                ) : (
                    <button type="submit" 
                        className="submit"
                    >Check code</button>
                )}
                { error && (
                    <div className="standard-container bg-red-500">
                        <p className="text-white">{error}</p>
                    </div>
                )}
            </div>
        </form>
    )
}