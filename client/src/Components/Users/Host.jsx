import axios from "axios";
import countryCodes from "country-codes-list";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";


export default function Host() {
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
        seeded: false,
        mobile: false,
    });
    const [serverError, setServerError] = useState(null);
    const [userId, setUserId] = useState(null);

    const handleCheckboxChange = (option) => {
        setCheckedState((prevState) => ({
            ...prevState,
            [option]: !prevState[option],
        }));
    };

    useEffect(() => {
        const getuserInfo = () => {
            const token = localStorage.getItem("Authorization");
            if (!token) window.location.assign("/");
            axios.get("/api/users/verify", {
                    headers: { Authorization: token }
                }).then((response) => {
                    setUserId(response.data.userId);
                }).catch((err) => {
                    console.log(err);
                });
        }

        getuserInfo();
    }, []);

    const onSubmit = async (data) => {
        setIsPending(true);
        data.userId = userId;
        console.log(data.userId)
        data.categories = [];
        for (let option in checkedState) {
            if (checkedState[option]) {
                // console.log(option);
                data.categories.push(option);
            }
        }
        data.seededPlayers = checkedState.seeded;
        data.showMobile = checkedState.mobile;

        try {
            await axios.post("/api/tournaments/create-tournament", data)
            .then((response) => {
                console.log(response.data.tournamentId);
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

        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            <div className="relative w-full h-full flex flex-col gap-2.5">
                    <h3 className="text-center mt-2.5">Tournament Details</h3>
                    <input type="text" className="form-input my-2.5" placeholder="Tournament Name" 
                        {...register("tournamentName", {
                            required: "Tournament Name is required"
                        })}
                    />
                <div className="form-input bg-slate-100">
                    <h4>Categories</h4>
                    <p className="text-sm mb-2.5">
                        Please select the categories you wish to include in your tournament. Invited users will be able to sign up these 
                        categories. This cannot be changed.
                    </p>
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
                <div className="form-input bg-slate-100">
                    <h4>Seeded Players</h4>
                    <p className="text-sm mb-2.5">
                        Seeded players are those which are of a certain level that you don't want them to be matched together in doubles tournaments. 
                        Selecting this option will give users the choice to declare themselves as a seeded player at sign up (although you as the host 
                        can also edit their selection later). This simply affects the random selection of teams, ensuring that each seeded player is 
                        teamed up with a non-seeded player. The remaining seeded players are matched with each other.
                    </p>
                    <label className={`tournament-button ${checkedState.seeded ? "checked" : ""}`}>
                        <p>Seeded Players</p>
                        <input
                            type="checkbox"
                            className="checkbox"
                            // checkedState={checkedState}
                            onChange={() => handleCheckboxChange("seeded")}
                        />
                        <span className="custom-checkbox"></span>
                    </label>
                </div>
                <div className="form-input bg-slate-100">
                    <h4>Mobiles Visible</h4>
                    <p className="text-sm mb-2.5">
                        Select this option if you want mobile contact details to be visible between players of a match. When matches are assigned, players 
                        can view their matches and see the contact details of other players. If you do select this option, please ensure that players 
                        are aware that their mobile numbers are visible to other players. This option can be altered later.
                    </p>
                    <label className={`tournament-button ${checkedState.mobile ? "checked" : ""}`}>
                        <p>Make Mobiles Visible</p>
                        <input
                            type="checkbox"
                            className="checkbox"
                            // checkedState={checkedState}
                            onChange={() => handleCheckboxChange("mobile")}
                        />
                        <span className="custom-checkbox"></span>
                    </label>
                </div>
                <button type="submit" 
                    className="submit"
                >Create Tournament</button>
            </div>
        </form>
    )
}