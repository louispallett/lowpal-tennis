import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import DialogBox from "../DialogBox";

export default function JoinTournamentForm({ validTournament }) {
    const location = useLocation();
    if (!validTournament) {
        validTournament = location.state?.data;
    }
    console.log(validTournament)

    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
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
        setIsPending(true);
        
        data.tournamentId = validTournament._id;
        data.gender = gender;
        data.seeded = checkedState.seeded;
        delete checkedState.seeded;

        for (let option in checkedState) {
            if (checkedState[option]) {
                data.categories.push(option);
            }
        }
        
        const token = localStorage.getItem("Authorization")
        axios.post("/api/tournaments/join-tournament", data, 
            { headers: { Authorization: token }}
        )
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
    }

    const [tournamentCategories, setTournamentCategories] = useState(null);

    useEffect(() => {
        const getCategories = () => {
            axios.get("/api/tournaments/get-tournament-categories", {
                headers: { tournamentId: validTournament._id }
            }).then((response) => {
                setTournamentCategories(response.data.categories);
            }).catch((err) => {
                console.log(err);
            });
        }
        getCategories();
    }, [])

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
        <>
            { validTournament ? (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
                    <div className="relative w-full h-full flex flex-col gap-2.5">
                        <h3 className="text-center">Tournament Details</h3>
                        <div className="flex flex-col lg:flex-row gap-2.5">
                            <input type="text" className="hidden form-input bg-indigo-500 text-white" defaultValue={validTournament._id} disabled
                                {...register ("tournamentId", {})}
                            />
                            <div type="text" className="form-input bg-indigo-500 text-white">
                                <p>{validTournament.name}</p>
                            </div>
                            <div type="text" className="form-input bg-indigo-500 text-white text-right">
                                <p>Hosted by: {validTournament.host["name-long"]}</p>
                            </div>
                        </div>
                        <h3 className="text-center">Your Tournament Preferences</h3>
                        <div>
                            <div className="relative">
                                <select name="gender" id="gender" required value={gender} onChange={handleGenderChange}
                                    className="form-input">
                                    <option value="">- &gt; Gender &lt; -</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                    <ChevronDownIcon className="h-6 w-6" />
                                </div>
                            </div>
                            {/* <span className="text-xs font-bold text-red-700 dark:text-red-400">
                                <p>{errors.gender?.message}</p>
                            </span> */}
                        </div>
                        { tournamentCategories && (
                            <div id="tournaments-wrapper" className={tournamentsVisible ? '' : 'hidden'}>
                                <h3 className="font-roboto text-center mt-2.5">Categories</h3>
                                <h4>Select at least one category you wish to play</h4>
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex gap-2.5">
                                        { gender == "male" ? (
                                            <>
                                                { tournamentCategories.includes("mSingles") && (
                                                    <label className={`tournament-button ${checkedState.mSingles ? "checked" : ""}`}>
                                                        <p>Men's Singles</p>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            onChange={() => handleCheckboxChange("mSingles")}
                                                        />
                                                        <span className="custom-checkbox"></span>
                                                    </label>
                                                )}
                                                { tournamentCategories.includes("mDoubles") && (
                                                    <label className={`tournament-button ${checkedState.mDoubles ? "checked" : ""}`}>
                                                        <p>Men's Doubles</p>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            onChange={() => handleCheckboxChange("mDoubles")}
                                                        />
                                                        <span className="custom-checkbox"></span>
                                                    </label>
                                                )}
                                            </>

                                        ) : (
                                            <>
                                                { tournamentCategories.includes("wSingles") && (
                                                    <label className={`tournament-button ${checkedState.wSingles ? "checked" : ""}`}>
                                                        <p>Women's Singles</p>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            onChange={() => handleCheckboxChange("wSingles")}
                                                        />
                                                        <span className="custom-checkbox"></span>
                                                    </label>
                                                )}
                                                { tournamentCategories.includes("wDoubles") && (
                                                    <label className={`tournament-button ${checkedState.wDoubles ? "checked" : ""}`}>
                                                        <p>Women's Doubles</p>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            onChange={() => handleCheckboxChange("wDoubles")}
                                                        />
                                                        <span className="custom-checkbox"></span>
                                                    </label>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    { tournamentCategories.includes("mixDoubles") && (
                                        <label className={`tournament-button ${checkedState.mixDoubles ? "checked" : ""}`}>
                                            <p>Mixed Doubles</p>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                onChange={() => handleCheckboxChange("mixDoubles")}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                    )}
                                    { validTournament.seededPlayers && (
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4>Seeded player</h4>
                                                <span className="text-detail-click" onClick={() => setIsOpen("seeded")}>What's this?</span>
                                            </div>
                                            <label className={`tournament-button ${checkedState.seeded ? "checked" : ""}`}>
                                                <p>I am a seeded player</p>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    onChange={() => handleCheckboxChange("seeded")}
                                                />
                                                <span className="custom-checkbox"></span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <button type="submit" 
                            className="submit"
                        >Join Tournament</button>
                    </div>
                    <DialogBox isOpen={isOpen} setIsOpen={setIsOpen} />
                </form>
            ) : (
                <p>No data receieved</p>
            )}
        </>
    )
}