import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

import { Spinner } from "../tailwind_components/tailwind-ex-elements";

export default function SignIn() {
    // See the playlist on react-hook-form (://www.youtube.com/playlist?list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s)
    const form = useForm();
    const { register, control, handleSubmit, formState, watch } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        setIsPending(true)
        axios.post("/api/users/sign-in", data)
            .then(response => {
                const token = response.data.token;
                if (!token) {
                    setIsPending(false);
                    console.log(response);
                    setLoginError(response.data.error);
                    console.log(loginError);
                    return;
                }
                localStorage.setItem("Authorization", token);
                window.location.assign("/dashboard");
            }).catch(err => {
                console.log(err);
                setIsPending(false);
                setServerError(err);
            })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {loginError && (
                    <p className="font-bold text-red-600 dark:text-red-400">{loginError}</p>
                )}
                {serverError && (
                    <p className="font-bold text-red-600 dark:text-red-400">Sorry, it looks like a server error has occured. Please inform the administrator.</p>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm leading-6 dark:text-slate-100">Email</label>
                    <input autoComplete="email" required id="email" {...register("email", {
                        required: "Email is required",
                        maxLength: {
                            value: 30,
                            message: "Email cannot be longer than twenty (30) characters long!"
                        },
                    })}
                        className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700" />
                </div>
                <span className="text-sm font-bold text-red-400">
                    <p>{errors.email?.message}</p>
                </span>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 sm:min-w-80 dark:text-slate-100">Password</label>
                    <div className="flex gap-1 items-center">
                        <input type={showPassword ? "text" : "password"} id="password" autoComplete="current-password" required
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least eight (8) characters long"
                                },
                            })}
                            className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"/>
                        { showPassword ? (
                            <EyeIcon onClick={() => setShowPassword(!showPassword)} className="h-6 cursor-pointer dark:fill-slate-100 hover:fill-indigo-600 transition-all" />
                        ) : (
                            <EyeSlashIcon onClick={() => setShowPassword(!showPassword)} className="h-6 cursor-pointer dark:fill-slate-100 hover:fill-indigo-600 transition-all" />
                        )}
                    </div>
                    <span className="text-sm font-bold text-red-400">
                        <p>{errors.password?.message}</p>
                    </span>
                </div>
                <span className="font-semibold m-0 p-0 text-sm text-right text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    <Link to="/users/forgot-password">Forgot password?</Link>
                </span>
                <div>
                    { isPending ? (
                        <div className="flex justify-center items-center">
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
                        ) : (
                            <button type="submit" 
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                            >Sign In</button>
                    )}
                </div>
            </form>
            {/* <p className="mt-10 text-center text-sm dark:text-white transition-all"> Not signed up yet? <Link to="/users/sign-up" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Sign Up</Link></p> */}
        </>
    )
}