
export default function Dashboard() {
    return (
        <div className="flex flex-col gap-2.5 mx-5">
            <div className="form-input bg-lime-400">
                <h3>Tournament Name</h3>
            </div>
            <div className="form-input bg-lime-400">
                <h4>Next Matches</h4>
            </div>
            <UserMatches />
            <div className="form-input bg-lime-400">
                Tournament Name Results
            </div>
            <TournamentResult />
        </div>
    )
}

function UserMatches() {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="form-input bg-indigo-500 text-white">
                <p className="text-center">Men's Singles</p>
                <hr className="my-2.5"/>
                <div className="grid grid-cols-3 text-center">
                    <p>John Smith</p>
                    <p>vs</p>
                    <p>Dave Doe</p>
                </div>
                <hr className="my-2.5"/>
            </div>
            <div className="form-input bg-indigo-500 text-white">
                <p className="text-center">Men's Doubles</p>
                <hr className="my-2.5"/>
                <div className="grid grid-cols-3 text-center">
                    <p>John Smith and Rueben Plaice</p>
                    <p>vs</p>
                    <p>Dave Doe and Simon Rentkins</p>
                </div>
                <hr className="my-2.5"/>
            </div>
            <div className="form-input bg-indigo-500 text-white">
                <p className="text-center">Mixed Doubles</p>
                <hr className="my-2.5"/>
                <div className="grid grid-cols-3 text-center">
                    <p>John Smith and Jane Rageon-Puton</p>
                    <p>vs</p>
                    <p>Rueben Plaice and Sasha Roman-Polanski</p>
                </div>
                <hr className="my-2.5"/>
            </div>
        </div>
    )
}

function TournamentResult() {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="form-input bg-indigo-500 text-white">
                <p>Men's Singles</p>
            </div>
            <div className="form-input">

            </div>
            <div className="form-input bg-indigo-500 text-white">
                <p>Women's Singles</p>
            </div>
            <div className="form-input">
                
            </div>
            <div className="form-input bg-indigo-500 text-white">
                <p>Men's Doubles</p>
            </div>
            <div className="form-input">
                
            </div>
            <div className="form-input bg-indigo-500 text-white">
                <p>Women's Doubles</p>
            </div>
            <div className="form-input">
                
            </div>
            <div className="form-input bg-indigo-500 text-white">
                <p>Mixed Doubles</p>
            </div>
            <div className="form-input">
                
            </div>
        </div>
    )
}