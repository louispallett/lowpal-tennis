import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import tennisBall from "/assets/images/tennis-ball.svg";

export default function Account() {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`/api/user/${userId}`, { mode: "cors" });
                if (!response.ok) throw new Error(response.status);
                const actualData = await response.json();
                setUserData(actualData.user);
                setError(null);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getUser();
    }, []);

    return (
        <div className="flex flex-1 lg:my-2.5 justify-center items-center">
            { error ? (
                <div className="flex justify-center p-5 bg-slate-50 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                    <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                        <h5 className="text-xl font-sedan tracking-tight text-center lg:text-left sm:text-2xl sm:font-black">500 ERROR</h5>
                        <img src={tennisBall} alt="" className="h-10" id="spinner" />
                        <p>Oops! Looks like a server error. Please take a screenshot, note the time, and contact the administrator.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-row-2 my-5 lg:my-0 gap-2.5">
                    <div className="flex flex-col justify-between lg:flex-row lg:gap-5 flex-1">
                        <UserPhoto userData={userData} loading={loading} />
                        <UserDetails matchId={matchId} />
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