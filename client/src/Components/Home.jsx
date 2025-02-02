import { Link } from "react-router-dom";
import racketRed from "/assets/images/racket-red.svg";
import racketBlue from "/assets/images/racket-blue.svg";

export default function Home() {
    return (
        <div className="flex-1 max-w-7xl mx-auto px-2 sm:px-4">
            <div className="mb-8">
                <div className="relative w-full mx-auto flex flex-col items-center">
                    <h1 className="main-title">
                        LowPal Tennis
                    </h1>
                    <div className="max-w-3xl text-center mt-5 text-slate-600 text-lg">
                        <p>
                            Ease the admin and tedium of organizing a tennis tournament by hosting it through LowPal tennis. Create a tournament today or 
                            join an existing tournament now!
                        </p>
                    </div>
                    <img src={racketRed} alt="" className="hidden lg:block transform -scale-x-100 w-16 lg:w-36 h-auto lg:absolute flex-shrink-0 -left-20 top-36 z-30" />
                    <img src={racketBlue} alt="" className="hidden lg:block w-16 lg:w-36 h-auto lg:absolute flex-shrink-0 -right-20 top-36 z-30" />
                </div>
            </div>
            <div className="relative">
                <div className="md:grid grid-cols-2 flex flex-col gap-2.5 justify-center">
                    <Host />
                    <Join />
                </div>
            </div>
        </div>
    )
}

function Host() {
    return (
        <div className="flex flex-col justify-between rounded-xl text-slate-50 relative z-20 p-4 sm:p-8 border-[3px] border-gray-900 bg-indigo-600 shadow-[5px_5px_0px_0px_#000000]">
            <div>
                <h3 className="font-roboto text-center">Host a tournament</h3>
                <div className="my-2.5">
                    <p>If you want to host a tennis tournament, <i>LowPal Tennis</i> makes the process simple. All you need to do is:</p>
                    <ul className="list-disc">
                        <li>Click below to start, creating a hosting account.</li>
                        <li>Once you've registered, you'll be given a tournament code. Share this code with your players which they can then use to join.</li>
                        <li>Once you close registration, you can automate the creation of the teams and matches at the click of a button!</li>
                        <li>Players will be able to see their matches, submit results, and see the results of other matches.</li>
                    </ul>
                    <p>We'll give you a detailed tutorial during registration - start now by clicking the button below:</p>
                </div>
            </div>
            <Link to="/users/host-a-tournament">
                <button type="none" 
                        className="submit bg-lime-300 text-black hover:bg-lime-500"
                >Host a tournament</button>
            </Link>
        </div>

    )
}

function Join() {
    return (
        <div className="rounded-xl relative z-20 p-4 sm:p-8 border-[3px] border-gray-900 bg-lime-300 shadow-[5px_5px_0px_0px_#000000]">
            <h3 className="font-roboto text-center">Join a tournament</h3>
            <div className="my-2.5">
                <p>
                    If someone has already begun hosting a tournament and you want to join, you can do so here! You'll need 
                    a <b>tournament code</b> which the host should be able to provide to you. To start:
                </p>
                <ul className="list-disc">
                    <li>Click <b>Join a tournament</b> below and enter the tournament code the host has provided for you.</li>
                    <li>
                        If the code is valid, you'll be taken to a sign up page, where you'll be able to create an account and register the 
                        tournament categories you wish to sign up to.
                    </li>
                    <li>Once the registration stage is over, the host will create the teams and matches using the in-built tools.</li>
                    <li>You'll then be able to view your upcoming matches, submit results, and view the results of all categories in your tournament.</li>
                </ul>
                <p>Happy playing! Click below to start:</p>
            </div>
            <Link to="/users/join-a-tournament">
                <button type="none" 
                        className="submit"
                >Join a tournament</button>
            </Link>
        </div>
    )
}