import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider, Outlet } from "react-router-dom";

import App from "./App";
import Home from "./Home";
import Users from "./Users/Users";
import HostATournament from "./Users/Host";
import JoinATournament from "./Users/JoinATournament";
import SignIn from "./Users/SignIn";
import Main from "./Main/Main";
import Dashboard from "./Main/Dashboard";
import Match from "./Main/Match";

export default function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                {
                    path: "/users",
                    element: <Users />,
                    children: [
                        {
                            path: "join-a-tournament",
                            element: <JoinATournament />
                        },
                        {
                            path: "host-a-tournament",
                            element: <HostATournament />
                        },
                        {
                            path: "sign-in",
                            element: <SignIn />
                        },
                        // {
                        //     path: "account",
                        //     element: <Account />
                        // },
                        // {
                        //     path: "forgot-password",
                        //     element: <ForgotPassword />
                        // },                     
                    ]
                },
            ]
        },
        {
            path: "/dashboard",
            element: <Main />,
            children: [
                {
                    index: true,
                    element: <Dashboard />
                },
                {
                    path: "match/:matchId",
                    element: <Match />
                }
            ]
        }
    ]);

    return <RouterProvider router={router} />;
}