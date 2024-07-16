import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tennisBall from "/assets/images/tennis-ball.svg";
import { CalendarIcon, CursorArrowRippleIcon } from "@heroicons/react/16/solid";


export default function Home() {
    const [userMatchData, setUserMatchData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserMatches = async () => {
            setLoading(true);
            const token = localStorage.getItem("Authorization");
            if (!token) window.location.assign("/users/sign-in");
            try {
                const response = await fetch("https://lowpal-tennis-server.fly.dev/api/match/matches", {
                    mode: "cors",
                    headers: { Authorization: token }
                });
                if (response.status < 400) {
                    const actualData = await response.json();
                    setUserMatchData(actualData.userMatchData);
                    setError(null);
                }
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getUserMatches();
    }, []);

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-2">
            <div>
                <WelcomeMessage />
                <ReportingIssues />
            </div>
            <div className="flex flex-col p-2.5 sm:p-2.5 sm:max-w-5xl gap-5">
                { loading && (
                    <div className="flex flex-1 justify-center items-center p-20 bg-slate-300 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-indigo-500 animate-spin dark:text-gray-600 fill-lime-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
                { userMatchData && (
                    userMatchData.length < 1 ? (
                        <>
                            <div className="flex justify-center p-5 bg-slate-200 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                                <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                                    <h5 className="text-xl font-sedan tracking-tight text-center lg:text-left sm:text-2xl sm:font-black">Matches</h5>
                                    <img src={tennisBall} alt="" className="h-10" id="spinner" />
                                    <p>It looks like there are no matches here yet! Please wait for sign-up to close and the host to create your matches.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        userMatchData.map(item => (
                            <MatchCard data={item} key={item._id} />
                        ))
                    )
                )}
                { error && (
                    <div className="flex justify-center p-5 bg-slate-200 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                        <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                            <h5 className="text-xl font-sedan tracking-tight text-center lg:text-left sm:text-2xl sm:font-black">Matches</h5>
                            <img src={tennisBall} alt="" className="h-10" id="spinner" />
                            <p>It looks like there are no matches here yet! Please wait for sign-up to close and the host to create your matches.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
// hover:opacity-80
function MatchCard({ data }) {
    return (
        <>
            { data && (
                <Link to={data._id} className="hover:-translate-y-1 hover:-translate-x-1 transition-all">
                    <div className="bg-lime-600 rounded-b-none rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                        <h5 className="p-3 text-xl font-sedan tracking-tight text-slate-50 text-center lg:text-left sm:text-2xl sm:font-black sm:p-5">{data.category.name}</h5>
                    </div>
                    <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)] text-sm lg:text-base dark:bg-slate-700">
                        <div className="grid grid-cols-3 items-center px-2.5 py-1.5 font-semi-bold text-center dark:text-slate-100 sm:px-4 sm:py-3.5">
                            <p>{data.participants[0].name}</p>
                            <p className="text-lg font-black"><i>vs</i></p>
                            <p>{data.participants[1] ? data.participants[1].name : "TBC"}</p>
                        </div>
                        <hr className="m-2.5 mx-10 sm:mx-20"/>
                        <div className="px-2.5 py-1.5 text-sm lg:text-base sm:px-4 sm:py-2.5 dark:text-slate-100">
                            <div className="flex items-center gap-2.5 my-1.5">
                                <CursorArrowRippleIcon className="h-4 w-4" />
                                { data.qualifyingMatch ? (<p className="dark:text-slate-100">Qualifying Match</p>) : (<p className="dark:text-slate-100">State:&nbsp; <b className="text-green-400">{data.state}</b></p>)}
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CalendarIcon className="h-4 w-4 my-1.5"/>
                            <p>Deadline to play:&nbsp; <b className="text-red-600">{data.startTime}</b></p>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </>
    )
}

function WelcomeMessage() {
    return (
        <div className="flex flex-col p-2.5 sm:p-2.5 sm:max-w-5xl">
            <div className="flex flex-col gap-3.5 text-white bg-indigo-600 dark:bg-indigo-600 p-2.5 rounded-lg text-sm sm:text-base shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
                <h3 className="text-center font-sedan text-2xl sm:text-3xl">Dashboard</h3>
                <p>Welcome to your dashboard. From here, you can navigate to your next match/matches by clicking on the relevant category (either below or to the right).</p>
                <p>You will also be able to navigate to the live tournament brackets for each tournament by clicking on the <b><Link to="/dashboard/brackets" className="text-lime-300 hover:text-lime-600 transition-all">Results </Link></b>
                    link in the top right (or via the menu on smaller screens). You can then select from the five on-going tournaments to see their current state.
                </p>
                <p>Using this site and submitting results has been designed so that it can be done so in a user-friendly manner. However, if you need some guidance on how to use it, or with to know more about how this site was made, 
                    please navigate to the site guidance page by clicking on the <Link to="/dashboard/about" className="text-lime-300 hover:text-lime-600 transition-all"><b>Site Guide</b></Link> link in the menu on the top-right.
                </p>
                <div>
                    <p>Finally, if you need a reminder of the rules in this tournament, including:</p>
                    <ul className="list-disc">
                        <li>Match structure and scoring</li>
                        <li>Organising and booking matches</li>
                        <li>Finals weekend</li>
                        <li>Player etiquette</li>
                    </ul>
                    <p>Please navigate to the rules page by clicking on <Link to="/dashboard/rules" className="text-lime-300 hover:text-lime-600 transition-all"><b>Tournament Rules</b></Link> on the menu.</p>
                </div>
            </div>
        </div>
    )
}

function ReportingIssues() {
    return (
        <div className="flex flex-col p-2.5 sm:p-2.5 sm:max-w-5xl">
            <div className="flex flex-col gap-3.5 text-white bg-indigo-600 dark:bg-indigo-600 p-2.5 rounded-lg text-sm sm:text-base shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
                <h3 className="text-center text-2xl font-sedan sm:text-3xl">Reporting Issues</h3>
                <p>This is a major project of mine and reflects around 18 months of studying various topics. Although this site effectively comes down to fetching and updating data, there are a few dependant sites, not limited to: the database, the server (hosted by one site), this website (hosted by another site), and various libraries.</p>
                <p>Testing has been a key aspect of building this site, but it is hard to identify every bug (especially considering the range of browsers people use).</p>
                <p>If you encounter an issue, please do let me know and I will aim to fix it as soon as possible. Additionally, if you have any suggestions in terms of styling or friendlier usage, these will be very welcome!</p>
            </div>
        </div>
    )
}