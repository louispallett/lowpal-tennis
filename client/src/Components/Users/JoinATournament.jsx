import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import JoinTournamentForm from "./JoinATournamentForm";

export default function JoinATournament() {
    return (
        <div>
            <SignUpParent />
            <div className="flex justify-center items-center mt-5 text-lg">
                <p>Already Signed Up?&nbsp;</p>
                <Link to="/users/sign-in">
                    <span className="text-click">Click here to login</span>
                </Link>
            </div>
        </div>

    )
}

function SignUpParent() {
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

function SignUpCode({ setValidCode }) {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setIsPending(true);
        axios.post("/api/tournaments/is-valid-code", data)
            .then((response) => {
                if (response) {
                    setValidCode(response.data);
                } else {
                    setResponse("Invalid Code");
                }
            }).catch((err) => {
                setError(err.response.statusText);
            });
            setIsPending(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            <div className="relative w-full h-full flex flex-col gap-2.5">
                <input type="text" className="form-input" placeholder="Tournament Code"
                    {...register ("tournamentCode", {
                        required: "Code is required",
                    })}
                />
                <button type="submit" 
                    className="submit"
                >Check code</button>
            </div>
        </form>
    )
}