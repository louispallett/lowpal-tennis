import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider, Outlet } from "react-router-dom";

import About from "./About";
import Bracket from "./Bracket";
import BracketsList from "./BracketsList";
import Users from "./Users/Users";
import SignIn from "./Users/SignIn";
import SignUp from "./Users/SignUp";
import Dashboard from "./Dashboard";
import Rules from "./Rules";
import Home from "./Home";
import Match from "./Match";
import UsingData from "./UsingData";
import ForgotPassword from "./Users/ForgotPassword";
import SiteDown from "./Users/SiteDown";
import Finals from "./Finals";

function Loading() {
    return (
        <div className="flex justify-center items-center p-20">
            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                    <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                        <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProtectedRoute({ isAuth, children }) {
    return isAuth ? children : <Navigate to="/users/site-down" replace />;
}

export default function Router() {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("Authorization");
            if (!token) {
                setIsLoading(false);
                return;
            };
            try {
                const response = await fetch("https://lowpal-tennis-server.fly.dev/api/users/verify", { 
                    mode: "cors", 
                    headers: { "Authorization": token} 
                })
                if (response.status < 400) {
                    setIsAuth(true);
                    setIsLoading(false);
                } else {
                    setIsAuth(false);
                    setIsLoading(false);
                }
            } catch (err) {
                console.log(err)
            }
        }
        checkUser();
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <ProtectedRoute isAuth={isAuth}><Outlet /></ProtectedRoute>,
            children: [
                {
                    path: "dashboard",
                    element: <Dashboard />,
                    children: [
                        {
                            // Using index allows us to set a default child!
                            index: true,
                            element: <Home />
                        },
                        {
                            path: ":matchId",
                            element: <Match />
                        },
                        {
                            path: "about",
                            element: <About />
                        },
                        {
                            path: "rules",
                            element: <Rules />
                        },
                        {
                            path: "brackets",
                            children: [
                                {
                                    index: true,
                                    element: <BracketsList />
                                },
                                {
                                    path: ":categoryId",
                                    element: <Bracket />
                                }
                            ]
                        },
                        {
                            path: "finals",
                            element: <Finals />
                        }
                    ]
                }
            ]
        },
        {
            path: "/users",
            element: <Users />,
            children: [
                // {
                //     path: "sign-up",
                //     element: isLoading ? <Loading /> : (isAuth ? <Navigate to="/dashboard" replace /> : <SignUp />)
                // },
                // {
                //     path: "sign-in",
                //     element: isLoading ? <Loading /> : (isAuth ? <Navigate to="/dashboard" replace /> : <SignIn />)
                // },
                // {
                //     path: "using-your-data",
                //     element: <UsingData />
                // },
                // {
                //     path: "forgot-password",
                //     element: <ForgotPassword />
                // },
                {
                    path: "site-down",
                    element: <SiteDown />
                }
            ]
        },
    ]);

    return <RouterProvider router={router} />;
}