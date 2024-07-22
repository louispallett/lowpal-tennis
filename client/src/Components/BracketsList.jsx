import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import tennisBall from "/assets/images/tennis-ball.svg";

export default function BracketsList() {
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://lowpal-tennis-server.fly.dev/api/brackets", { mode: "cors" });
                if (response.status < 400) {
                    const actualData = await response.json();
                    setCategories(actualData.categories);
                }
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getCategories();
    }, []);
    

    return (
        <div className="flex my-10 mx-2.5 flex-col flex-1 items-center gap-5">
            <div>
                <div className="bg-lime-600 rounded-b-none rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                    <h5 className="p-3 text-xl font-sedan text-slate-50 text-center sm:text-3xl sm:font-black sm:p-5">Tournament Brackets</h5>
                </div>
                <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)] text-sm lg:text-base dark:bg-slate-700">
                    <div className="flex flex-col gap-2.5 p-2.5 dark:text-slate-100">
                        <p>The tournament brackets below are designed using a library called <a href="https://github.com/g-loot/react-tournament-brackets?tab=readme-ov-file" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"><b>react-tournament-brackets</b></a>. I'm greatful to the contributors to this project who made displaying these brackets 'live' possible. Because the information for these brackets are fetched directly from the database, when a player updates their scores, the brackets are immediately updated.</p>
                        <p>However, the design of this library means that double eliminations are done in a way which creates a more complex bracket. It would mean placing all double eliminations on one side of the bracket which is quite complicated.</p>
                        <p>Therefore, qualification matches are not included in these brackets. If a category does not have a number of players which is equal to a perfect power of 2 (2, 4, 8, 16, 32, etc.), there are qualification matches and some players receive byes. These matches are not included in the brackets and therefore some of the first matches you play may not be included in the brackets.</p>
                        <p>The solution to this problem is to build a library myself but, time is my enemy, and therefore this will have to do for now.</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center bg-lime-600 rounded-lg text-sm px-10 lg:text-base shadow-[5px_5px_0px_0px_#4f46e5] min-w-full">
                <h5 className="p-3 text-lg tracking-tight font-sedan text-slate-100 text-center sm:text-2xl sm:p-5">Select a tournament below</h5>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-5">
                { loading && (
                    <div className="flex justify-center items-center p-20">
                        <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                    <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                        <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                { categories && categories.map(item => (
                    <CategoryCard data={item} key={item._id} />
                ))}
                { error && (
                    <div className="flex justify-center p-5 bg-slate-200 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                        <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                            <h5 className="text-xl font-sedan tracking-tight text-center lg:text-left sm:text-2xl sm:font-black">500 ERROR</h5>
                            <img src={tennisBall} alt="" className="h-10" id="spinner" />
                            <p>Oops! Looks like a server error. Please take a screenshot, note the time, and contact the administrator.</p>
                        </div>
                    </div>
                )}
            </div>
            {/* <div className="flex justify-center p-5 bg-slate-50 rounded-lg dark:bg-slate-700 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col items-center gap-5 min-w-full rounded-lg rounded-t-none text-sm lg:text-base dark:text-slate-100">
                    <h5 className="text-xl font-sedan tracking-tight text-center lg:text-left sm:text-2xl sm:font-black">No Brackets Yet</h5>
                    <img src={tennisBall} alt="" className="h-10" id="spinner" />
                    <p>Please wait for sign-up to close and the host to create your matches.</p>
                </div>
            </div> */}
        </div>
    )
}

function CategoryCard({ data }) {
    return (
        <Link to={data._id} className="hover:-translate-y-1 hover:-translate-x-1 transition-all">
            <div className="bg-lime-600 rounded-lg shadow-[5px_5px_0px_0px_#4f46e5]">
                <h5 className="p-3 text-xl font-sedan tracking-tight text-slate-50 text-center lg:text-left sm:text-2xl sm:font-black sm:p-5">{data.name}</h5>
            </div>
        </Link>
    )
}
