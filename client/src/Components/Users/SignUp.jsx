import { DevTool } from "@hookform/devtools";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Spinner } from "../tailwind_components/tailwind-ex-elements";
import arrow from "/assets/images/select-arrow.svg";

export default function SignUp() {
    const form = useForm();
    const navigate = useNavigate();
    const { register, control, handleSubmit, formState, watch } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);

    const onSubmit = async (data) => {
        setIsPending(true);
        fetch("/api/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            console.log("Successfully Submitted")
            navigate("/users/sign-in");
        }). catch((err) => console.log(err));
    }

    const [gender, setGender] = useState('');
    const [tournamentsVisible, setTournamentsVisible] = useState(false);
    const [checkBoxes, setCheckBoxes] = useState({
        mensSingles: false,
        womensSingles: false,
        mensDoubles: false,
        womensDoubles: false,
        mixedDoubles: false
    });
  
    const handleGenderChange = (event) => {
        const selectedGender = event.target.value;
        setGender(selectedGender);
        setTournamentsVisible(selectedGender === 'male' || selectedGender === 'female');
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="flex gap-2.5">
                    <div>
                        <div>
                            <label htmlFor="firstName" className="text-sm leading-6 font-bold">First Name</label>
                            <input required id="firstName" {...register("firstName", {
                                required: "First Name is required",
                                maxLength: {
                                    value: 50,
                                    message: "First name cannot be longer than a fifty (50) characters long!"
                                },
                            })}
                                className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                        <span className="text-sm font-bold text-red-700">
                            <p>{errors.firstName?.message}</p>
                        </span>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="lastName" className="text-sm leading-6 font-bold">Last Name</label>
                            <input required id="lastName" {...register("lastName", {
                                required: "Last Name is required",
                                maxLength: {
                                    value: 50,
                                    message: "Last name cannot be longer than a fifty (50) characters long!"
                                },
                            })}
                                className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                        <span className="text-sm font-bold text-red-700">
                            <p>{errors.lastName?.message}</p>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="text-sm leading-6 font-bold">Email</label>
                    <input autoComplete="email" required id="email" {...register("email", {
                        required: "Email is required",
                        maxLength: {
                            value: 100,
                            message: "Email cannot be longer than a hundred (100) characters long!"
                        },
                    })}
                        className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                </div>
                <span className="text-sm font-bold text-red-700">
                    <p>{errors.email?.message}</p>
                </span>
                <div>
                    <label htmlFor="gender" id="gender" onChange={handleGenderChange} className="font-bold text-sm leading-6 text-grey-900">Gender</label>
                    <div className="relative">
                        <select name="gender" id="gender" required value={gender} onChange={handleGenderChange}
                            className="appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            // {...register("gender", {
                            //     required: "Gender is required"
                            // })}
                            >
                            <option value="">- - Gender - -</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <img src={arrow} alt="" className="fill-black h-4 w-4" />
                        </div>
                    </div>
                    {/* <span className="text-sm font-bold text-red-700">
                        <p>{errors.gender?.message}</p>
                    </span> */}
                </div>
                <div id="tournaments-wrapper" className={tournamentsVisible ? '' : 'hidden'}>
                    <p>Tournaments</p>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                        <div className="flex items-center mb-4">
                            <input type="checkbox" id="mens-singles" value="mens-singles" disabled={gender == "female"}
                                className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            <label htmlFor="mens-singles" name="mens-singles" className="font-bold leading-6 text-grey-900 ms-2" >Men's Singles</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input type="checkbox" id="womens-singles" value="womens-singles" disabled={gender == "male"}
                                className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            <label htmlFor="womens-singles" name="womens-singles" className="font-bold leading-6 text-grey-900 ms-2" >Women's Singles</label>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex items-center mb-4">
                            <input type="checkbox" id="mens-doubles" value="mens-doubles" disabled={gender == "female"}
                                className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            <label htmlFor="mens-doubles" name="mens-doubles" className="font-bold leading-6 text-grey-900 ms-2" >Men's Doubles</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input type="checkbox" id="womens-doubles" value="womens-doubles" disabled={gender == "male"}
                                className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            <label htmlFor="womens-doubles" name="womens-doubles" className="font-bold leading-6 text-grey-900 ms-2" >Women's Doubles</label>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex item-center mb-4">
                            <input type="checkbox" id="mixed-doubles" value="mixed-doubles" disabled={false}
                                className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            <label htmlFor="mixed-doubles" name="mixed-doubles" className="font-bold leading-6 text-grey-900 ms-2" >Mixed Doubles</label>
                        </div>
                    </div>
                    <p>Seeded</p>
                    <hr className="my-2" />
                    <p className="text-sm px-2.5 py-1.5 rounded-md bg-indigo-300"><b>Note</b>: Seeded players are those who have played for the 1st team during league matches <b>or</b> would be picked to do so (as they decided not to play). If you are unsure whether you are a seeded player, please contact your team captain.</p>
                    <div className="flex justify-start mt-2.5">
                        <div className="flex items-center mb-4">
                            <input type="checkbox" id="seeded" value="seeded" className="w-4 h-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            <label htmlFor="seeded" name="seeded" className="font-bold leading-6 text-grey-900 ms-2" >Seeded Player</label>

                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="password" className="text-sm leading-6 font-bold">Password</label>
                    <input type="password" id="password" autoComplete="current-password" required 
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least eight (8) characters long"
                            },
                        })} 
                        className="w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"/>
                    <span className="text-sm font-bold text-red-700">
                        <p>{errors.password?.message}</p>
                    </span>
                </div>
                <div>
                    { isPending ? (
                            <div className="flex justify-center">
                                <Spinner id="spinner"/>
                            </div>
                        ) : (
                            <button type="submit" 
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >Sign In</button>
                    )}
                </div>
            </form>
            {/* Development: */}
            <DevTool control={control}/> 
            <p className="mt-10 text-center text-sm"> Not a member? <Link to="/users/sign-in" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign In</Link></p>
        </>
    )
}