import axios from "axios";
import countryCodes from "country-codes-list";
import { useForm } from "react-hook-form";
import { useState } from "react";


export default function Host() {
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
    });
    const [gender, setGender] = useState("");
    const [serverError, setServerError] = useState(null);
    const [loginError, setLoginError] = useState(null);

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    }

    const handleCheckboxChange = (option) => {
        setCheckedState((prevState) => ({
            ...prevState,
            [option]: !prevState[option],
        }));
    };

    const onSubmit = async (data) => {
        data.tournamentId = "";
        setIsPending(true);
        data.categories = [];
        for (let option in checkedState) {
            if (checkedState[option]) {
                // console.log(option);
                data.categories.push(option);
            }
        }
        // console.log(data.categories)
        data.gender = gender;

        try {
            await axios.post("/api/tournaments/create-tournament", data)
            .then((response) => {
                console.log(response.data.tournamentId);
                data.tournamentId = response.data.tournamentId;
            }).catch((err) => {
                console.log(err.response.data.error);
                if (err.response.data.errors) {
                    setSignupError(err.response.data.error);
                } else {
                    setSignupError(`${err.response.statusText}. Sorry, a server error occured. Please contact the administrator.`);
                }
                setIsPending(false);
                return;
            });

            data.categories = [];

            await axios.post("/api/users/sign-up", data)
                .then((response) => {
                    data.hostId = response.data.userId;
                }).catch((err) => {
                    console.log(err.response.data.errors[0].msg);
                    if (err.response.data.errors) {
                        setSignupError(err.response.data.errors);
                    } else {
                        setSignupError(`${err.response.statusText}. Sorry, a server error occured. Please contact the administrator.`);
                    }
                    setIsPending(false);
                    throw new Error("");
                });

            await axios.post("/api/tournaments/assign-tournament-host", data)
                .then((response) => {
                    console.log("Successfully assigned user to host tournament")
                }).catch((err) => {
                    console.log(err.response.data.errors[0].msg);
                    if (err.response.data.errors) {
                        setSignupError(err.response.data.errors);
                    } else {
                        setSignupError(`${err.response.statusText}. Sorry, a server error occured. Please contact the administrator.`);
                    }
                    setIsPending(false);
                    throw new Error("");
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
                    // window.location.assign("/dashboard");
                }).catch((err) => {
                    console.log(err);
                    setIsPending(false);
                    setServerError(err);
                })
        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            <div className="relative w-full h-full flex flex-col gap-2.5">
                <h3 className="font-roboto text-center">Host Details</h3>
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
                <div id="tournaments-wrapper">
                    <h3 className="text-center mt-2.5">Tournament Details</h3>
                    <input type="text" className="form-input my-2.5" placeholder="Tournament Name" 
                        {...register("tournamentName", {
                            required: "Tournament Name is required"
                        })}
                    />
                    <h4 className="text-center">Select categories you want to include</h4>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex gap-2.5">
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
                        </div>
                        <div className="flex gap-2.5">
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
                    </div>
                </div>
                <h3 className="font-roboto text-center mt-2.5">Account Password</h3>
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
                >Create Tournament and Sign Up</button>
            </div>
        </form>
    )
}