/*==============================================================================================================
 * Dashboard.jsx
 * -------------------------------------------------------------------------------------------------------------
 *
 *  This is our main page where all information about a tournament can be accessed. Currently, we are running on
 *  the notion of ONE tournament per host/player, but I should change this in the future to run this as:
 *
 *  	Sign in -> Tournament selection page -> Tournament page
 *
 *  Sign in page (/users/sign-in)
 *  	Our normal sign in page, nothing too interesting - returns JWT and reloads to selection page
 *  
 *  Tournament selection page (/dashboard)
 *  	This is a simple page which fetches the user's tournament via their JWT. It then fetches the basic 
 *  	information about each tournament (just what is on the tournament models) and displays them. The user 
 *  	can then select which tournament they want to go to and it will send them to the relevant page.
 *
 *  	NOTE: Under tournament selection page, we should split these by stage - "Sign Up", "Active", and "Finished".
 *  	So, three different sections, each for a stage. Then, within the stages, we should pass order them by the 
 *  	date started. So:
 *
 *  		Sign Up:
 *  			Latest tournament - created today
 *  			Mid tournament - created 1 week ago
 *  			Earliest tournament - created 3 weeks ago
 *
 *  		Active: 
 *  			Latest - created today
 *  			Earliest - created 6 months ago
 *
 *  		Finished:
 *  			Latest - created 4 months ago
 *  			Earliest - created 2 years ago
 *
 *	This means that, even if someone had a small tournament they hosted and finished a few weeks ago, it's not 
 *	going to appear BEFORE an ONGOING tournament which started 6 months ago. We should probably title these!
 *  			
 *
 *  Tournament dashboard page (/dashboard/:tournamentId)
 *  	This is the page which contains ALL the major information about the tournament. It will contain:
 *  		- Tournament name and details
 *  		- User matches (selectable - they go to:
 *  			-> match page (/:matchId)
 *  				-> Info on match
 *  				-> Player contact details
 *  				-> Results submission form
 *  		- Current results of each category
 *  		- Tournament rules
 *  			-> NOTE: This will require use of a rich text editor of some kind - probably best to 
 *  			use TinyMCE again...
 *  	Anything else?
 *
 * The aim of this is to make as few pages as possible, which is a better UI and reduces complexity. It also means
 * we can make fewer requests and utilize :variables in the address. This means we can fetch the tournaments the user
 * is signed up to via the JWT, and then the tournament info via the :variable.
 *
 * NOTE: Put a 'Jump to' section at the top of the dashboard page for easier navigation. Do NOT fix the menu bar
 * as an absolute element otherwise this will not help with the jump feature.
 *
*/

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