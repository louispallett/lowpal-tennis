import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

import racketRed from "/assets/images/racket-red.svg";
import racketBlue from "/assets/images/racket-blue.svg";

export default function Users() {
    return (
        <div className="flex-1 w-full">
            <div className="max-w-7xl mx-auto py-8">
                <div className="mb-4">
                    <div className="relative w-full mx-auto flex flex-col">
                        <Link to="/">
                            <h1 className="main-title">
                                LowPal Tennis
                            </h1>
                        </Link>
                        <div className="racket-cross-wrapper">
                            <img src={racketRed} alt="" />
                            <img src={racketBlue} alt="" />
                        </div>
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