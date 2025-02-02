import axios from "axios";
import countryCodes from "country-codes-list";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

import DialogBox from "../DialogBox";

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
    // const [validCode, setValidCode] = useState({ code: "adjlowejpoh0938q3j", name: "2025 Saltford In-House Tournament"});
    const [validCode, setValidCode] = useState(false);

    return (
        <>
            {validCode ? (
                <SignUpForm tournamentCode={validCode} />
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

    const onSubmit = async (data) => {

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

function SignUpForm({ tournamentCode }) {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const countryCodesArray = Object.entries(countryCodes.customList('countryCode', '{countryCode}: +{countryCallingCode}'));
    const [showPassword, setShowPassword] = useState(false);
    const [signupError, setSignupError] = useState(null);
    const [checkedState, setCheckedState] = useState({
        mSingles: false,
        mDoubles: false,
        wSingles: false, 
        wDoubles: false,
        mixDoubles: false,
        seeded: false
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleCheckboxChange = (option) => {
        setCheckedState((prevState) => ({
            ...prevState,
            [option]: !prevState[option],
        }));
    };

    const onSubmit = async (data) => {
        for (let option in checkedState) {
            if (checkedState[option]) console.log(option);
        }
        // setIsPending(true);
        // data.gender = gender;
        // data.categories = categories;
        // if (data.seeded) data.seeded = true;
        // axios.post("api/users/sign-up", data)
        //     .then(() => {
        //         setIsPending(false);
        //         setIsSubmitted(true);
        //     }).catch((err) => {
        //         console.log(err.response.data.errors[0].msg);
        //         if (err.response.data.errors) {
        //             setSignupError(err.response.data.errors);
        //         } else {
        //             setSignupError(`${err.response.statusText}. Sorry, a server error occured. Please contact the administrator.`);
        //         }
        //         setIsPending(false);
        //     });
    }

    const [gender, setGender] = useState("");
    const [tournamentsVisible, setTournamentsVisible] = useState(false);

    const handleGenderChange = (event) => {
        setCheckedState((prevState) => {
            const resetState = Object.keys(prevState).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            return resetState;
        });
        const selectedGender = event.target.value;
        setGender(selectedGender);
        setTournamentsVisible(selectedGender === 'male' || selectedGender === 'female');
        reset({ categories: [] });
        setValue("gender", selectedGender);
        trigger("gender");
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            <div className="relative w-full h-full flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                    <input type="text" className="form-input" value={tournamentCode.code} disabled
                        {...register ("tournamentCode", {})}
                    />
                    <input type="text" className="form-input" value={tournamentCode.name} disabled
                        {...register ("tournamentCode", {})}
                    />
                </div>
                <h3 className="font-roboto text-center">Personal Details</h3>
                <div className="grid grid-cols-2 gap-2.5">
                    <input type="text" placeholder="First Name" className="form-input" 
                        required id="firstName" {...register("firstName", {
                            required: "First Name is required",
                            maxLength: {
                                value: 50,
                                message: "First name cannot be longer than a fifty (50) characters long!"
                            },
                        })}
                    />
                    {/* <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        <p>{errors.firstName?.message}</p>
                    </span> */}
                    <input type="text" placeholder="Last Name" className="form-input" 
                        {...register("lastName", {
                            required: "Last Name is required",
                            maxLength: {
                                value: 50,
                                message: "Last name cannot be longer than a fifty (50) characters long!"
                            },
                        })}
                    />
                    {/* <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        <p>{errors.lastName?.message}</p>
                    </span> */}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                    <input type="email" placeholder="Email" className="form-input" 
                        required id="email" {...register("email", {
                            required: "Email is required",
                            maxLength: {
                                value: 100,
                                message: "Email cannot be longer than a hundred (100) characters long!"
                            },
                        })}
                    />
                    {/* <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        <p>{errors.email?.message}</p>
                    </span> */}
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
                        {/* <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            <p>{errors.mobile?.message}</p>
                        </span> */}
                    </div>
                </div>
                <div>
                    <div className="relative">
                        <select name="gender" id="gender" required value={gender} onChange={handleGenderChange}
                            className="form-input">
                            <option value="">- &gt; Gender &lt; -</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    {/* <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        <p>{errors.gender?.message}</p>
                    </span> */}
                </div>
                <div id="tournaments-wrapper" className={tournamentsVisible ? '' : 'hidden'}>
                    <h3 className="font-roboto text-center mt-2.5">Categories</h3>
                    <h4>Select at least one category you wish to play</h4>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex gap-2.5">
                            { gender == "male" ? (
                                <>
                                    <label className={`tournament-button ${checkedState.mSingles ? "checked" : ""}`}>
                                        <p>Men's Singles</p>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            // checkedState={checkedState}
                                            onChange={() => handleCheckboxChange("mSingles")}
                                        />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                    <label className={`tournament-button ${checkedState.mDoubles ? "checked" : ""}`}>
                                        <p>Men's Doubles</p>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            // checkedState={checkedState}
                                            onChange={() => handleCheckboxChange("mDoubles")}
                                        />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </>

                            ) : (
                                <>
                                    <label className={`tournament-button ${checkedState.wSingles ? "checked" : ""}`}>
                                        <p>Women's Singles</p>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            // checkedState={checkedState}
                                            onChange={() => handleCheckboxChange("wSingles")}
                                        />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                    <label className={`tournament-button ${checkedState.wDoubles ? "checked" : ""}`}>
                                        <p>Women's Doubles</p>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            // checkedState={checkedState}
                                            onChange={() => handleCheckboxChange("wDoubles")}
                                        />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </>
                            )}
                        </div>
                        <label className={`tournament-button ${checkedState.mixDoubles ? "checked" : ""}`}>
                            <p>Mixed Doubles</p>
                            <input
                                type="checkbox"
                                className="checkbox"
                                // checkedState={checkedState}
                                onChange={() => handleCheckboxChange("mixDoubles")}
                            />
                            <span className="custom-checkbox"></span>
                        </label>
                        <div>
                            <div className="flex gap-1.5">
                                <h4>Seeded player</h4>
                                <span className="text-detail-click" onClick={() => setIsOpen("seeded")}>What's this?</span>
                            </div>
                            <label className={`tournament-button ${checkedState.seeded ? "checked" : ""}`}>
                                <p>I am a seeded player</p>
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    // checkedState={checkedState}
                                    onChange={() => handleCheckboxChange("seeded")}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <h3 className="font-roboto text-center mt-2.5">Password</h3>
                <div className="grid grid-cols-2 gap-2.5">
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
                            className="form-input"/>
                        {/* <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            <p>{errors.password?.message}</p>
                        </span> */}
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
                                className="form-input"/>
                                {/* { showPassword ? (
                                <EyeIcon onClick={() => setShowPassword(!showPassword)} className="h-6 cursor-pointer dark:fill-slate-100 hover:fill-indigo-600 transition-all" />
                                ) : (
                                    <EyeSlashIcon onClick={() => setShowPassword(!showPassword)} className="h-6 cursor-pointer dark:fill-slate-100 hover:fill-indigo-600 transition-all" />
                                )} */}
                        </div>
                        {/* <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            <p>{errors.confPassword?.message}</p>
                        </span> */}
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