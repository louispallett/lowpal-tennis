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
            <TournamentStage stage={data.tournament.stage} openCategoriesLength={openCategories.length} />
            { openCategories.length > 0 && (
                <>
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
                </>
            )}
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

function TournamentStage({ stage, openCategoriesLength }) {
    const [isCloseRegOpen, setIsCloseRegOpen] = useState(false);
    const [isFinishOpen, setIsFinishOpen] = useState(false);

    return (
        <div className="form-input bg-indigo-600 text-white">
            { stage === "sign-up" && (
                <>
                    <h4>Stage: Sign-Up</h4>
                    <h5 className="text-center">Closing registration</h5>
                    <p>
                        Currently, the tournament is in it's 'sign-up' stage, meaning users with the right code can join. Once you wish to close registration, click the
                        button below. Then you can use our tool to create the teams and matches.
                    </p>
                    <button
                        className="submit text-center"
                        onClick={() => setIsCloseRegOpen(true)}
                    >
                        Close registration
                    </button>
                    <CloseRegistration isOpen={isCloseRegOpen} setIsOpen={setIsCloseRegOpen} />
                </>
            )}
            { stage === "play" && (
                <div className="flex flex-col gap-2.5">
                    <h4>Stage: Play</h4>
                    { openCategoriesLength > 0 ? (
                        <>
                            <h5 className="text-center italic">Creating Teams and/or Matches</h5>
                            <p>
                                The tournament is currently in the 'play' stage, however you still have categories below which require team and/or match creation.
                                To create the necessary matches/teams, click on a category below and follow the directions on the page.
                            </p>
                            <p>
                                Once you create the matches for a category, it will be locked, and you won't able to access this page again.
                            </p>
                        </>
                    ) : (
                        <>
                            <h5 className="text-center italic">Time to play!</h5>
                            <p> You've created matches for all the categories in your tournament. Now all that's left is for your players to play their matches!</p>
                            <button
                                className="submit bg-lime-600 text-center"
                                onClick={() => setIsFinishOpen(true)}
                            >
                                Finish Tournament
                            </button>
                            <CloseRegistration isOpen={isFinishOpen} setIsOpen={setIsFinishOpen} />
                        </>
                    )}
                </div>
            )}
            { stage === "finished" && (
                <>
                    <h4>Stage: Finished</h4>
                    <p>Thank you for using <i>LowPal Tennis</i>! </p>
                </>
            )}
        </div>
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