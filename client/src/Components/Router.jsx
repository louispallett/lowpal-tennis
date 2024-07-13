/* 
========================
CLIENT SIDE TODO LIST 
========================

- Create our tournament brackets using react-tournament-bracket and the current information we have created on the backend.
- Finish home page by fetching relevant information (each match can have an #id matching it's mongo _id)
- Create individual matchId pages where users can submit scores
- Create a dialog box after clicking 'sign up' to detail how data is used. The sign-up box will trigger this dialog whilst the 'I agree' in the dialog will actually submit the information (and close the dialog box)
- Finish About page, tournament rules, etc.

*/



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

function ProtectedRoute({ isAuth, children }) {
    return isAuth ? children : <Navigate to="/users/sign-in" replace />;
}

export default function Router() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("Authorization");
            if (!token) {
                return;
            };
            try {
                const response = await fetch("/api/users/verify", { 
                    mode: "cors", 
                    headers: { "Authorization": token} 
                })
                if (response.status < 400) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
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
                    ]
                }
            ]
        },
        {
            path: "/users",
            element: <Users />,
            children: [
                {
                    path: "sign-up",
                    element: isAuth ? <Navigate to="/dashboard" replace /> : <SignUp />
                },
                {
                    path: "sign-in",
                    element: isAuth ? <Navigate to="/dashboard" replace /> : <SignIn />
                }
            ]
        },
    ]);

    return <RouterProvider router={router} />;
}
