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
 * They cannot directly edit:
 *
 *  - gender
 *  - categories
 *
 * ======================
 * # Resetting password #
 * ======================
 *
 * Ensure that any checks regarding current password are done on the backend and not the client-side. 
 * We can check for requirements as we do during sign up (we'll want to use react-hook-form again):
 *  
 *  - minimum characters
 *  - upper and lower case
 *  - special character
 *  - numerical characters
 *
 * Obviously we'll want to check this on the backend too. But, in addition to this, we also want to 
 * check whether the new password they have entered is the same as their current one.
 */

// TODO: Add details
// TODO: Reset password feature

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import tennisBall from "/assets/images/tennis-ball.svg";

export default function Account() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(null);
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
        console.log(userData)
    }, []);

    return (
        <div className="flex flex-1 lg:my-2.5 justify-center items-center">
            { error ? (
                <div className="flex justify-center p-5 bg-slate-50 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                    <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                        <h5 className="text-xl font-sedan tracking-tight text-center lg:text-left sm:text-2xl sm:font-black">{error.status} server error</h5>
                        <img src={tennisBall} alt="" className="h-10" id="spinner" />
                        <p>Oops! Looks like a server error. Please take a screenshot, note the time, and contact the administrator.</p>
                        <p><b>{error.status}</b>: {error.message}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-row-2 my-5 lg:my-0 gap-2.5">
                    <div className="flex flex-col justify-between lg:flex-row lg:gap-5 flex-1">
                        <UserPhoto userData={userData} loading={loading} />
                        <UserDetails userData={userData} />
                    </div>
                    <PasswordReset loading={loading} />
                </div>
            )}
        </div>
    )
}

function UserPhoto() {
    return (
        <>

        </>
    )
}

function UserDetails() {
    return (
        <>
        
        </>
    )
}

function PasswordReset() {
    return (
        <>
        
        </>
    )
}
