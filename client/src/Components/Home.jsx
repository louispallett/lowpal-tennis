import { Link } from "react-router-dom"

export default function Categories() {

    const data = {
        category: "Men's Singles",
        nextMatchId: "00983470980fuj398r",
        tournamentRoundText: "1",
        state: "SCHEDULED",
        participants: [
            {
                player: {
                    firstName: "John",
                    lastName: "Doe",
                },
                resultText: null,
                isWinner: false,
                status: null,
                name: "John Doe"
            },
            {
                player: {
                    firstName: "Sam",
                    lastName: "Roe",
                },
                resultText: null,
                isWinner: false,
                status: null,
                name: "Anna Roe"
            }
        ]
    }

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-2">
            <div>
                <WelcomeMessage />
                <ReportingIssues />
            </div>
            <div className="flex flex-col p-2.5 sm:p-2.5 sm:max-w-5xl gap-5">
                <CategoryCardTest data={data} />
                <CategoryCardTest data={data} />
                <CategoryCardTest data={data} />
            </div>
        </div>
    )
}

function CategoryCard({ data }) {
    return (
        <Link to={data._id} className="hover:opacity-80">
            <div className="bg-lime-600 rounded-b-none rounded-lg">
                <h5 className="p-3 text-2xl font-kanit font-bold tracking-tight text-gray-100 sm:text-4xl sm:font-black sm:p-5">{data.title}</h5>
            </div>
            <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none shadow dark:bg-slate-700">
                {data.image_url ? (
                    <img src={data.image_url} alt="" className="object-cover max-h-96 max-w-full" />
                ) : (
                    <img src={imagePlaceholder} alt="" className="object-contain max-h-96 max-w-full" />
                )}
                <p className="self-start italic px-2.5 py-3.5 sm:px-3 sm:py-4 dark:text-slate-100">{data.synopsis}</p>
            </div>
        </Link>
    )
}

function CategoryCardTest({ data }) {
    return (
        <Link className="hover:opacity-80">
            <div className="bg-lime-600 rounded-b-none rounded-lg">
                <h5 className="p-3 text-xl font-kanit font-bold tracking-tight text-gray-100 sm:text-2xl sm:font-black sm:p-5">{data.category}</h5>
            </div>
            <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none shadow dark:bg-slate-700">
                <p className="self-start italic px-2.5 py-3.5 sm:px-3 sm:py-4 dark:text-slate-100">Next Match</p>
            </div>
        </Link>
    )
}

function WelcomeMessage() {
    return (
        <div className="flex flex-col p-2.5 sm:p-2.5 sm:max-w-5xl">
            <div className="flex flex-col gap-3.5 text-white bg-indigo-600 dark:bg-indigo-400 p-2.5 rounded-lg text-sm shadow-lg ring-1 ring-black ring-opacity-5 sm:text-base">
                <h3 className="text-center text-2xl sm:text-3xl">Dashboard</h3>
                <p>Welcome to your dashboard. From here, you can navigate to your next match/matches by clicking on the relevant category (either below or to the right).</p>
                <p>You will also be able to navigate to the live tournament brackets for each tournament by clicking on the <b><Link to="/dasshboard/brackets" className="text-lime-300 hover:text-lime-400">Results </Link></b>
                    link in the top right (or via the menu on smaller screens). You can then select from the five on-going tournaments to see their current state.
                </p>
                <p>Using this site and submitting results has been designed so that it can be done so in a user-friendly manner. However, if you need some guidance on how to use it, or with to know more about how this site was made, 
                    please navigate to the site guidance page by clicking on the <Link to="/dasshboard/guide" className="text-lime-300 hover:text-lime-400"><b>Site Guide</b></Link> link in the menu on the top-right.
                </p>
                <div>
                    <p>Finally, if you need a reminder of the rules in this tournament, including:</p>
                    <ul className="list-disc">
                        <li>Match structure and scoring</li>
                        <li>Organising and booking matches</li>
                        <li>Finals weekend</li>
                        <li>Player etiquette</li>
                    </ul>
                    <p>Please navigate to the rules page by clicking on <Link to="/dasshboard/guide" className="text-lime-300 hover:text-lime-400"><b>Tournament Rules</b></Link> on the menu.</p>
                </div>
            </div>
        </div>
    )
}

function ReportingIssues() {
    return (
        <div className="flex flex-col p-2.5 sm:p-2.5 sm:max-w-5xl">
            <div className="flex flex-col gap-3.5 text-white bg-indigo-600 dark:bg-indigo-400 p-2.5 rounded-lg text-sm shadow-lg ring-1 ring-black ring-opacity-5 sm:text-base">
                <h3 className="text-center text-2xl sm:text-3xl">Reporting Issues</h3>
                <p>This is a major project of mine and reflects around 18 months of studying various topics. Although this site effectively comes down to fetching and updating data, there are a few dependant sites, not limited to: the database, the server (hosted by one site), this website (hosted by another site), and various libraries.</p>
                <p>Testing has been a key aspect of building this site, but it is hard to identify every bug (especially considering the range of browsers people use).</p>
                <p>If you encounter an issue, please do let me know and I will aim to fix it as soon as possible. Additionally, if you have any suggestions in terms of styling or friendlier usage, these will be very welcome!</p>
            </div>
        </div>
    )
}