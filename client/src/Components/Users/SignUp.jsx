import axios from "axios";
import countryCodes from "country-codes-list";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

import DialogBox from "../DialogBox";

export default function SignUp() {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const countryCodesArray = Object.entries(countryCodes.customList('countryCode', '{countryCode}: +{countryCallingCode}'));
    const [showPassword, setShowPassword] = useState(false);
    const [signupError, setSignupError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (data) => {
        setIsPending(true);

        await axios.post("/api/users/sign-up", data)
            .then(() => {
                setIsPending(false);
                setIsSubmitted(true);
            }).catch((err) => {
                console.log(err);
                // console.log(err.response.data.errors[0].msg);
                // if (err.response.data.errors) {
                //     setSignupError(err.response.data.errors);
                // } else {
                //     setSignupError(`${err.response.statusText}. Sorry, a server error occured. Please contact the administrator.`);
                // }
                setIsPending(false);
            });

        await axios.post("/api/users/sign-in", data)
            .then((response) => {
                const token = response.data.token;
                if (!token) {
                    setIsPending(false);
                    console.log(response);
                    setLoginError(response.data.error);
                    console.log(loginError);
                    throw new Error("");
                }
                localStorage.setItem("Authorization", token);
                window.location.assign("/main");
                console.log("Success");
            }).catch((err) => {
                console.log(err);
                setIsPending(false);
                setServerError(err);
            })
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            <div className="relative w-full h-full flex flex-col gap-2.5">
                <h3 className="font-roboto text-center">Create an account</h3>
                <div className="grid grid-cols-2 gap-2.5">
                    <div>
                        <input type="text" placeholder="First Name" className="form-input"
                            required id="firstName" {...register("firstName", {
                                required: "First Name is required",
                                maxLength: {
                                    value: 50,
                                    message: "First name cannot be longer than a fifty (50) characters long!"
                                },
                            })}
                        />
                        <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            <p>{errors.firstName?.message}</p>
                        </span>
                    </div>
                    <div>
                        <input type="text" placeholder="Last Name" className="form-input"
                            {...register("lastName", {
                                required: "Last Name is required",
                                maxLength: {
                                    value: 50,
                                    message: "Last name cannot be longer than a fifty (50) characters long!"
                                },
                            })}
                        />
                        <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            <p>{errors.lastName?.message}</p>
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                    <div>
                        <input type="email" placeholder="Email" className="form-input"
                            required id="email" {...register("email", {
                                required: "Email is required",
                                maxLength: {
                                    value: 100,
                                    message: "Email cannot be longer than a hundred (100) characters long!"
                                },
                            })}
                        />
                        <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            <p>{errors.email?.message}</p>
                        </span>
                    </div>
                    <div>
                        <div className="mobile-wrapper">
                            <select name="countryCode" id="countryCode" defaultValue="GB: +44"
                                required
                                {...register("mobCode")}
                                className="form-input"
                            >
                                {countryCodesArray.map(([code, label]) => (
                                    <option key={code} value={label}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <input type="tel" placeholder="Mobile" className="form-input"
                                {...register("mobile", {
                                    required: "Mobile is required",
                                })}
                            />
                        </div>
                        <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            <p>{errors.mobile?.message}</p>
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                    <div>
                        <div>
                            <input type={showPassword ? "text" : "password"} id="password" autoComplete="current-password" required placeholder="Password"
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
                                className="form-input"
                            />
                            <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                <p>{errors.password?.message}</p>
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <input type={showPassword ? "text" : "password"} id="confPassword" required placeholder="Confirm Password"
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
                                className="form-input"
                            />
                                {/* { showPassword ? (
                                <EyeIcon onClick={() => setShowPassword(!showPassword)} className="h-6 cursor-pointer dark:fill-slate-100 hover:fill-indigo-600 transition-all" />
                                ) : (
                                    <EyeSlashIcon onClick={() => setShowPassword(!showPassword)} className="h-6 cursor-pointer dark:fill-slate-100 hover:fill-indigo-600 transition-all" />
                                )} */}
                        </div>
                        <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            <p>{errors.confPassword?.message}</p>
                        </span>
                    </div>
                </div>
                <button type="submit" 
                    className="submit"
                >Sign Up</button>
            </div>
            <DialogBox isOpen={isOpen} setIsOpen={setIsOpen} />
        </form>
    )
}