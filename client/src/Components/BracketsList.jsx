import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function BracketsList() {
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/brackets", { mode: "cors" });
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
                    <h5 className="p-3 text-xl font-kanit tracking-tight text-slate-200 text-center lg:text-left sm:text-2xl sm:font-black sm:p-5">Tournament Brackets</h5>
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
                <h5 className="p-3 text-lg tracking-tight text-slate-100 text-center sm:text-2xl sm:p-5">Select a tournament below</h5>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-5">
                { loading && (
                    <div className="flex flex-1 justify-center items-center p-20 m-5 bg-slate-300 rounded-lg shadow dark:bg-slate-700">
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-indigo-500 animate-spin dark:text-gray-600 fill-lime-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
                { categories && categories.map(item => (
                    <CategoryCard data={item} key={item._id} />
                ))}
            </div>
        </div>
    )
}

function CategoryCard({ data }) {
    return (
        <Link to={data._id} className="hover:-translate-y-1 hover:-translate-x-1 transition-all">
            <div className="bg-lime-600 rounded-lg shadow-[5px_5px_0px_0px_#4f46e5]">
                <h5 className="p-3 text-xl font-kanit tracking-tight text-slate-200 text-center lg:text-left sm:text-2xl sm:font-black sm:p-5">{data.name}</h5>
            </div>
        </Link>
    )
}
