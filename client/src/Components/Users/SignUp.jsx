import axios from "axios";
import countryCodes from "country-codes-list";
import { DevTool } from "@hookform/devtools";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Spinner } from "../tailwind_components/tailwind-ex-elements";
import arrow from "/assets/images/select-arrow.svg";

export default function SignUp() {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const countryCodesArray = Object.entries(countryCodes.customList('countryCode', '+{countryCallingCode}'));

    const onSubmit = async (data) => {
        setIsPending(true);
        data.gender = gender;
        data.mobile = `${data.phoneCode} ${data.mobile}`
        if (data.seeded) data.seeded = true;
        axios.post("/api/users/sign-up", data)
            .then(() => {
                setIsPending(false);
                setIsSubmitted(true);
            }).catch((err) => {
                console.log(err);
            });
    }

    const [gender, setGender] = useState('');
    const [tournamentsVisible, setTournamentsVisible] = useState(false);
  
    const handleGenderChange = (event) => {
        const selectedGender = event.target.value;
        setGender(selectedGender);
        setTournamentsVisible(selectedGender === 'male' || selectedGender === 'female');
    };

    return (
        <>
            {isSubmitted ? (
                <div className="flex flex-col gap-2.5 dark:text-white">
                    <p className="text-center">Successfully Submitted!</p>
                    <p>Thank you for registering to play in the 2024 Saltford Lawn Tennis Club In-House Tournament.</p>
                    <p>You should have received an email from saltfordtourn2023@gmail.com confirming your sign-up and the categories you have signed up to. Please feel free to respond to this email if you have any questions.</p>
                </div>
            ) : (
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <div>
                                    <label htmlFor="firstName" className="text-sm leading-6 font-bold dark:text-white">First Name</label>
                                    <input required id="firstName" {...register("firstName", {
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
                                    <input required id="lastName" {...register("lastName", {
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
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5">
                            <div>
                                <div>
                                    <label htmlFor="email" className="text-sm leading-6 font-bold dark:text-white">Email</label>
                                    <input autoComplete="email" type="email" required id="email" {...register("email", {
                                        required: "Email is required",
                                        maxLength: {
                                            value: 100,
                                            message: "Email cannot be longer than a hundred (100) characters long!"
                                        },
                                    })}
                                        className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700" />
                                </div>
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.email?.message}</p>
                                </span>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="mobile" className="text-sm leading-6 font-bold dark:text-white">Mobile</label>
                                    <div className="flex gap-1.5">
                                        <select name="countryCode" id="countryCode" defaultValue="+44"
                                        {...register("phoneCode")}
                                        className="rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700">
                                            {countryCodesArray.map(([code, label]) => (
                                                <option key={code} value={label}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        <input required id="mobile" type="tel" {...register("mobile", {
                                            required: "Mobile is required",
                                        })}
                                            className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white dark:bg-slate-700" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.email?.message}</p>
                                </span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="gender" id="gender" onChange={handleGenderChange} className="font-bold text-sm leading-6 dark:text-white">Gender</label>
                            <div className="relative">
                                <select name="gender" id="gender" required value={gender} onChange={handleGenderChange}
                                    className="appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white dark:bg-slate-700">
                                    <option value="">- - Gender - -</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <img src={arrow} alt="" className="h-4 w-4" />
                                </div>
                            </div>
                            <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                <p>{errors.gender?.message}</p>
                            </span>
                        </div>
                        <div id="tournaments-wrapper" className={tournamentsVisible ? '' : 'hidden'}>
                            <p className="dark:text-white">Tournaments</p>
                            <hr className="my-2" />
                            <div className="flex justify-between">
                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="666f36e408bbfeb7beb9cb9b" value="666f36e408bbfeb7beb9cb9b" disabled={gender == "female"}
                                        className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        {...register("categories")} />
                                    <label htmlFor="666f36e408bbfeb7beb9cb9b" name="666f36e408bbfeb7beb9cb9b" className="font-bold leading-6 text-grey-900 ms-2 dark:text-white" >Men's Singles</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="666f36e408bbfeb7beb9cb9c" value="666f36e408bbfeb7beb9cb9c" disabled={gender == "male"}
                                        className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        {...register("categories")} />
                                    <label htmlFor="666f36e408bbfeb7beb9cb9c" name="666f36e408bbfeb7beb9cb9c" className="font-bold leading-6 text-grey-900 ms-2 dark:text-white" >Women's Singles</label>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="666f36e408bbfeb7beb9cb9d" value="666f36e408bbfeb7beb9cb9d" disabled={gender == "female"}
                                        className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        {...register("categories")} />
                                    <label htmlFor="666f36e408bbfeb7beb9cb9d" name="666f36e408bbfeb7beb9cb9d" className="font-bold leading-6 text-grey-900 ms-2 dark:text-white" >Men's Doubles</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="666f36e408bbfeb7beb9cb9e" value="666f36e408bbfeb7beb9cb9e" disabled={gender == "male"}
                                        className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        {...register("categories")} />
                                    <label htmlFor="666f36e408bbfeb7beb9cb9e" name="666f36e408bbfeb7beb9cb9e" className="font-bold leading-6 text-grey-900 ms-2 dark:text-white" >Women's Doubles</label>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex item-center mb-4">
                                    <input type="checkbox" id="666f36e408bbfeb7beb9cb9f" value="666f36e408bbfeb7beb9cb9f" disabled={false}
                                        className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        {...register("categories")} />
                                    <label htmlFor="666f36e408bbfeb7beb9cb9f" name="666f36e408bbfeb7beb9cb9f" className="font-bold leading-6 text-grey-900 ms-2 dark:text-white" >Mixed Doubles</label>
                                </div>
                            </div>
                            <p className="dark:text-white">Seeded</p>
                            <hr className="my-2" />
                            <div className="text-sm px-2.5 py-1.5 rounded-md bg-indigo-300">
                                <p><b>Note</b>: Seeded players are those who have played for the 1st team during league matches <b>or</b> would be picked to do so (as they decided not to play).</p>
                                <p>This information will be checked, however, so it's not an issue if you answer incorrectly!</p>
                            </div>
                            <div className="flex justify-start mt-2.5">
                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="seeded" value="seeded" className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    {...register("seeded")} />
                                    <label htmlFor="seeded" name="seeded" className="font-bold leading-6 text-grey-900 ms-2 dark:text-white" >I am a Seeded Player</label>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <label htmlFor="password" className="text-sm leading-6 font-bold dark:text-white">Password</label>
                                <input type="password" id="password" autoComplete="current-password" required
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
                                <input type="password" id="confPassword" required
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
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                    <p>{errors.confPassword?.message}</p>
                                </span>
                            </div>
                        </div>
                        <div>
                            { isPending ? (
                                    <div className="flex justify-center">
                                        <Spinner id="spinner"/>
                                    </div>
                                ) : (
                                    <button type="submit" 
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >Sign Up</button>
                            )}
                        </div>
                    </form>
                    {/* Development: */}
                    <DevTool control={control}/> 
                    <p className="mt-10 text-center text-sm dark:text-white"> Already a member? <Link to="/users/sign-in" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Sign In</Link></p>
                </div>
            )}
        </>
    )
}