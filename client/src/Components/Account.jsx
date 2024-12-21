/* --------------------------------------------------------------------------------------------------
 * Account.jsx
 * ==================================================================================================
 *
 * This page allows users to edit certain parts of their account. They are allowed to edit:
 *
 *  - first name
 *  - last name
 *  - email address
 *  - reset password
 *
 * The last two will trigger the server to send a message to their email address.
 * 
 * ~ Updates Needed ~
 * 
 * TODO: Update is submitted to appropriate annimation
 * FIXME: Fix error handling when submitting forms - currently just loops
 */

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import countryCodes from "country-codes-list";
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from "@heroicons/react/16/solid";

import tennisBall from "/assets/images/tennis-ball.svg";

export default function Account() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem("Authorization");
            if (!token) {
                return;
            }
            try {
                const response = await fetch(`/api/users/verify`, { 
                    mode: "cors",
                    headers: { "Authorization": token }
                });
                if (!response.ok) {
                    const error = new Error(`HTTP error: ${response.status}`);
                    error.status = response.status;
                    error.statusText = response.statusText;
                    throw error;
                }
                const actualData = await response.json();
                setUserData(actualData);
                setError(null);
            } catch (err) {
                console.log(err);
                const errorDetails = {
                    status: err.status || "Unknown",
                    message: err.statusText || err.message || "An error occured"
                };
                setUserData(null);
                setError(errorDetails);
            } finally {
                setLoading(false);
            }
        }
        getUser();
    }, []);

    return (
        <div className="flex flex-1 lg:my-2.5 justify-center items-center">
            { error && (
                <div className="flex justify-center p-5 bg-slate-50 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                    <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                        <h5 className="text-xl font-sedan tracking-tight text-center lg:text-left sm:text-2xl sm:font-black">{error.status} server error</h5>
                        <img src={tennisBall} alt="" className="h-10" id="spinner" />
                        <p>Oops! Looks like a server error. Please take a screenshot, note the time, and contact the administrator.</p>
                        <p><b>{error.status}</b>: {error.message}</p>
                    </div>
                </div>
            )} 
            { userData && (
                <div className="flex flex-1 flex-col lg:grid grid-cols-2 my-5 lg:my-0 gap-2.5">
                    <UserPhoto userData={userData} loading={loading} />
                    <div className="flex flex-col flex-1 justify-between gap-2.5">
                        <UserDetails userData={userData} />
                        <PasswordReset />
                    </div>
                </div>
            )}
            { loading && (
                <img src={tennisBall} className="h-20" id="spinner"/>
            )}
        </div>
    )
}

function UserPhoto({ userData }) {
    return (
        <div className="flex flex-1 flex-col gap-1.5 mx-1.5">
            <div className="flex flex-1 flex-col justify-center items-center p-5 bg-slate-50 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                    { userData.profilePicture ? (
                        <img src={userData.profilePicture} className="w-64" alt="The profile picture of the user" />
                    ) : (
                        <UserCircleIcon src={UserCircleIcon} className="w-64" alt="" />
                    )}
                </div>
                <p className="font-bold dark:text-slate-100">{userData.firstName} {userData.lastName}</p>
            </div>
        </div>
    )
}

function UserDetails({ userData }) {
    const form = useForm({
        defaultValues: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            mobCode: userData.mobCode,
            mobile: userData.mobile
        }
    });
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const countryCodesArray = Object.entries(countryCodes.customList('countryCode', '+{countryCallingCode}'));
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = async (data) => {
        setIsPending(true);
        data.id = userData.userId;
        axios.post("/api/users/update-personal-details", data)
            .then(() => {
                setIsPending(false);
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                }, 3000);
                setIsEditing(false);
            }).catch((err) => {
                console.log(err);
                console.log(err.response.data.errors[0].msg);
                if (err.response.data.errors) {
                    setError(err.response.data.errors);
                } else {
                    setError(`${err.response.statusText}. Sorry, a server error occured. Please contact the administrator.`);
                }
                setIsPending(false);
            });
    }

    return (
        <div className="flex flex-col gap-1.5 mx-1.5">
            <div className="flex justify-center p-5 bg-slate-50 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                    <h2 className="text-2xl">Account Details</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <div>
                                    <label htmlFor="firstName" className="text-sm leading-6 font-bold dark:text-white">First Name</label>
                                    <input required disabled={!isEditing} id="firstName" {...register("firstName", {
                                        required: "First Name is required",
                                        maxLength: {
                                            value: 50,
                                            message: "First name cannot be longer than a fifty (50) characters long!"
                                        },
                                    })}
                                        className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700" />
                                </div>
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.firstName?.message}</p>
                                </span>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="lastName" className="text-sm leading-6 font-bold dark:text-white">Last Name</label>
                                    <input required disabled={!isEditing} id="lastName" {...register("lastName", {
                                        required: "Last Name is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Last name cannot be longer than a fifty (50) characters long!"
                                        },
                                    })}
                                        className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700" />
                                </div>
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.lastName?.message}</p>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col lg:grid grid-cols-2 gap-2.5">
                            <div>
                                <div>
                                    <label htmlFor="email" className="text-sm leading-6 font-bold dark:text-white">Email</label>
                                    <input required disabled={!isEditing} autoComplete="email" type="email" id="email" {...register("email", {
                                        required: "Email is required",
                                        maxLength: {
                                            value: 100,
                                            message: "Email cannot be longer than a hundred (100) characters long!"
                                        },
                                    })}
                                        className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700" />
                                </div                                >
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.email?.message}</p>
                                </span>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="mobile" className="text-sm leading-6 font-bold dark:text-white">Mobile</label>
                                    <div className="flex gap-1.5">
                                        <select disabled={!isEditing} name="countryCode" id="countryCode" defaultValue="+44"
                                        {...register("mobCode")}
                                        className="rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700">
                                            {countryCodesArray.map(([code, label]) => (
                                                <option key={code} defaultValue={label}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        <input required disabled={!isEditing} id="mobile" type="tel" {...register("mobile", {
                                            required: "Mobile is required",
                                        })}
                                            className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.mobile?.message}</p>
                                </span>
                            </div>
                        </div>
                        { isPending && (
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
                        )}
                        { isSubmitted ? (
                            // Temp
                            <p>Submitted!</p>
                        ) : isEditing ? (
                                <div className="flex gap-2.5">
                                    <button type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                                    >Save and Update</button>
                                    <div onClick={() => setIsEditing(false)} 
                                    className="flex w-full justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                                    >Cancel</div>
                                </div>
                            ) : (
                                <div onClick={() => setIsEditing(true)}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                                >Edit</div>
                            )
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

function PasswordReset() {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        setIsPending(true);
        data.id = userData.userId;
        axios.post("/api/users/update-password", data)
            .then(() => {
                setIsPending(false);
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                }, 3000);
            }).catch((err) => {
                console.log(err);
                console.log(err.response.data.errors[0].msg);
                if (err.response.data.errors) {
                    setError(err.response.data.errors);
                } else {
                    setError(`${err.response.statusText}. Sorry, a server error occured. Please contact the administrator.`);
                }
                setIsPending(false);
            });
    }

    return (
        <div className="flex flex-col gap-1.5 mx-1.5">
            <div className="flex justify-center p-5 bg-slate-50 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                    <h2 className="text-2xl">Reset Password</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <div className="md:flex gap-2.5">
                            <div>
                                <label htmlFor="password" className="text-sm leading-6 font-bold dark:text-white">Password</label>
                                <input type={showPassword ? "text" : "password"} id="password" autoComplete="current-password" required
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least eight (8) characters long"
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                            message: "Must contain: uppercase, lowercase, number, and special character"
                                        },
                                    })}
                                    className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"/>
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.password?.message}</p>
                                </span>
                            </div>
                            <div>
                                <label htmlFor="confPassword" className="text-sm leading-6 font-bold dark:text-white">Confirm Password</label>
                                <div className="flex items-center gap-1">
                                    <input type={showPassword ? "text" : "password"} id="confPassword" required
                                        {...register("confPassword", {
                                            required: "Please confirm your password",
                                            validate: {
                                                passwordMatch: (fieldValue) => {
                                                    return (
                                                        fieldValue == watch("password") || "Passwords do not match"
                                                    )
                                                }
                                            }
                                        })}
                                        className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700"/>
                                        { showPassword ? (
                                        <EyeIcon onClick={() => setShowPassword(!showPassword)} className="h-6 cursor-pointer dark:fill-slate-100 hover:fill-indigo-600 transition-all" />
                                        ) : (
                                            <EyeSlashIcon onClick={() => setShowPassword(!showPassword)} className="h-6 cursor-pointer dark:fill-slate-100 hover:fill-indigo-600 transition-all" />
                                        )}
                                </div>
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.confPassword?.message}</p>
                                </span>
                            </div>
                        </div>
                        { isSubmitted ? (
                            // Temp
                            <p>Submitted</p>
                        ) : (
                            <button type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                            >Save and Update</button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
