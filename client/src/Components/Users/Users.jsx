import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

import racketRed from "/assets/images/racket-red.svg";
import racketBlue from "/assets/images/racket-blue.svg";

export default function Users() {
    return (
        <div className="flex-1 w-full">
            <div className="max-w-7xl mx-auto py-8">
                <div className="mb-24">
                    <div className="relative w-full mx-auto flex flex-col">
                        <Link to="/">
                            <h1 className="main-title">
                                LowPal Tennis
                            </h1>
                        </Link>
                        {/* <div className="mt-5 text-slate-700 text-lg">
                            <p>Welcome to LowPal Tennis!</p>
                        </div> */}
                        <img src={racketRed} alt="" className="hidden lg:block transform -scale-x-100 w-16 lg:w-36 h-auto lg:absolute flex-shrink-0 -left-20 top-36 z-30" />
                        <img src={racketBlue} alt="" className="hidden lg:block w-16 lg:w-36 h-auto lg:absolute flex-shrink-0 -right-20 top-36 z-30" />
                    </div>
                </div>
                <div className="relative">
                    <div className="rounded-xl mx-2 md:mx-4 lg:mx-16 relative z-20 p-4 sm:p-8 border-[3px] border-gray-900 bg-lime-300 shadow-[5px_5px_0px_0px_#000000]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}