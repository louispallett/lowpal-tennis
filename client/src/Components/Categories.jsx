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
        <div className="flex flex-col my-20 mx-2.5 gap-5 md:flex-row">
            <CategoryCardTest data={data} />
            <CategoryCardTest data={data} />
            <CategoryCardTest data={data} />            
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