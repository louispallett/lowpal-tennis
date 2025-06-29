"use client"

import axios from "axios";
import countryCodes from "country-codes-list";
import { useForm } from "react-hook-form";
import { useState } from "react";


export default function HostForm() {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [signupError, setSignupError] = useState(null);
    const [checkedState, setCheckedState] = useState({
        ["Men's Singles"]: false,
        ["Men's Doubles"]: false,
        ["Women's Singles"]: false, 
        ["Women's Doubles"]: false,
        ["Mixed Doubles"]: false,
        mobile: false,
    });
    const [serverError, setServerError] = useState(null);

    const handleCheckboxChange = (option) => {
        setCheckedState((prevState) => ({
            ...prevState,
            [option]: !prevState[option],
        }));
    };

    const onSubmit = async (data:any) => {
        setIsPending(true);
        data.categories = [];
        data.showMobile = checkedState.mobile;
        delete checkedState.mobile;
        for (let option in checkedState) {
            if (checkedState[option]) {
                data.categories.push(option);
            }
        }


        axios.post("/api/tournament", data)
        .then((response) => {
            setSuccess(true);
            window.location.assign(`/dashboard/${response.data._id}`);
        }).catch((err:any) => {
            console.log(err);
            return;
        }).finally(() => {
            setIsPending(false);
        });
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            <div className="relative w-full h-full flex flex-col gap-2.5">
                    <h3 className="text-center mt-2.5">Tournament Details</h3>
                    <input type="text" className="form-input my-2.5" placeholder="Tournament Name" 
                        {...register("name", {
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
                            <label className={`tournament-button ${checkedState["Men's Singles"] ? "checked" : ""}`}>
                                <p>Men's Singles</p>
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={() => handleCheckboxChange("Men's Singles")}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                            <label className={`tournament-button ${checkedState["Women's Singles"] ? "checked" : ""}`}>
                                <p>Women's Singles</p>
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={() => handleCheckboxChange("Women's Singles")}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                        </div>
                        <div className="flex gap-2.5">
                            <label className={`tournament-button ${checkedState["Men's Doubles"] ? "checked" : ""}`}>
                                <p>Men's Doubles</p>
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={() => handleCheckboxChange("Men's Doubles")}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                            <label className={`tournament-button ${checkedState["Women's Doubles"] ? "checked" : ""}`}>
                                <p>Women's Doubles</p>
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={() => handleCheckboxChange("Women's Doubles")}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                        </div>
                        <label className={`tournament-button ${checkedState["Mixed Doubles"] ? "checked" : ""}`}>
                            <p>Mixed Doubles</p>
                            <input
                                type="checkbox"
                                className="checkbox"
                                onChange={() => handleCheckboxChange("Mixed Doubles")}
                            />
                            <span className="custom-checkbox"></span>
                        </label>
                    </div>
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
                            onChange={() => handleCheckboxChange("mobile")}
                        />
                        <span className="custom-checkbox"></span>
                    </label>
                </div>
                <button type="submit" 
                    className={success ? "success" : "submit"}
                >
                    { success ? (
                        <>Success! Redirecting...</>
                    ) : (
                        <>
                            { isPending ? (
                                <div className="flex justify-center items-center">
                                    <div className="spinner h-6 w-6"></div>
                                </div>
                            ) : (
                                <>Create Tournament</>
                            ) }
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}