import { useState } from "react"
import { Link } from "react-router-dom";
import CloseRegistration from "./CloseRegistration.jsx";


export default function HostSection({ data }) {
    // If matches have already been created for a match, category.locked will be TRUE, so filter these out
    const openCategories = data.categories.filter(category => !category.locked);
    return (
        <div className="form-input bg-slate-100 flex flex-col gap-2.5">
            <h3>Host Section</h3>
            <p>Hi {data.firstName}! Welcome to your host section. Here you can make unique operations and changes to the tournament reserved only for you (as host).</p>
            <TournamentStage stage={data.tournament.stage} />
            <h4 className="text-center mt-4">Categories</h4>
            <p>
                Below you'll see each category for your tournament. You can click on each individual category to find out information about the category and create the matches
                for each category in your tournament.
            </p>
            <div className="tournament-grid-sm">
                { openCategories.map(item => (
                    <CategoryFunctions data={item} key={item._id} />
                ))}
            </div>
            {/* { data.tournament.stage === "finished" && (
                <div className="tournament-grid-sm">
                    { openCategories.map(item => (
                        <CategoryFunctions data={item} key={item._id} />
                    ))}
                </div>
            )} */}
            {/* { data.tournament.stage === "sign-up" || data.tournament.stage === "play" && (
                <EditSettings data={data}/>
            )} */}
        </div>
    )
}

function TournamentStage({ stage }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            { stage === "sign-up" && (
                <>
                    <h4 className="text-center">Closing registration</h4>
                    <p>
                        Currently, the tournament is in it's 'sign-up' stage, meaning users with the right code can join. Once you wish to close registration, click the
                        button below. Then you can use our tool to create the teams and matches.
                    </p>
                    <button
                        className="submit text-center"
                        onClick={() => setIsOpen(true)}
                    >
                        Close registration
                    </button>
                    <CloseRegistration isOpen={isOpen} setIsOpen={setIsOpen} />
                </>
            )}
        </>
    )
}

function CategoryFunctions({ data, key }) {
    return (
            <Link to={"category/" + data._id}>
                <button
                    className="submit"
                >
                    {data.name}
                </button>
            </Link>
    )
}