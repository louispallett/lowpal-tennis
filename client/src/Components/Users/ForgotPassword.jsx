import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function ForgotPassword() {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [serverError, setServerError] = useState(null);

    const onSubmit = async (data) => {
        setIsPending(true)
        axios.post("https://lowpal-tennis-server.fly.dev/api/users/forgot-password", data)
            .then(response => {
                if (!response.data.msg) {
                    setIsPending(false);
                    setServerError(response.data.error);
                    return;
                }
                setIsPending(false);
                setIsSubmitted(true);
            }).catch(err => {
                console.log(err);
                setIsPending(false);
                setServerError(err.response);
            })
    }

    return (
        <div className="dark:text-slate-100">
            <hr className="m-5"/>
            <p className="font-semibold text-center">Forgot Password</p>
            <hr className="m-5"/>
            { isSubmitted ? (
                <div className="flex flex-col gap-2.5 dark:text-white">
                    <p className="text-center">Successfully Submitted!</p>
                    <p>Thank you - an email has been sent to your account with your new password.</p>
                    <p>You can use this password to <Link to="/users/sign-in" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Sign In</Link> to your account again.</p>
                </div>
            ) : (
                <>
                    <p className="semi-bold pb-2.5">Please enter the email you used to sign up.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        {serverError && (
                            <p className="font-bold text-red-600 dark:text-red-400">{serverError}</p>
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
                                    >Submit</button>
                            )}
                        </div>
                    </form>
                </>
                )}
        </div>
    )
}