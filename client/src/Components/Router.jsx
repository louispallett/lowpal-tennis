import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Home from "./Home";
import Users from "./Users/Users";
import HostATournament from "./Users/Host";
import JoinATournament from "./Users/JoinATournament";
import JoinATournamentForm from "./Users/JoinATournamentForm";
import SignIn from "./Users/SignIn";
import Main from "./Main/Main";
import Dashboard from "./Main/Dashboard";
import Category from "./Main/Category";
import Match from "./Main/Match";
import DashboardSelect from "./Main/DashboardSelect";
import SignUp from "./Users/SignUp";
import Account from "./Main/Account";

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
                            path: "sign-up",
                            element: <SignUp />
                        },
                        {
                            path: "sign-in",
                            element: <SignIn />
                        },                
                    ]
                },
            ]
        },
        {
            path: "/main",
            element: <Main />,
            children: [
                {
                    index: true,
                    element: <DashboardSelect />
                },
                {
                    path: "users",
                    element: <Users />,
                    children: [
                        {
                            path: "create-tournament",
                            element: <HostATournament />
                        },
                        {
                            path: "join-existing-tournament",
                            element: <JoinATournament />
                        },
                        {
                            path: "join-existing-tournament-form",
                            element: <JoinATournamentForm />
                        },
                        {
                            path: "account-settings",
                            element: <Account />
                        }
                    ]
                },
                {
                    path: "tournament/:tournamentId",
                    children: [
                        {
                            index: true,
                            element: <Dashboard />
                        },
                        {
                            path: "category/:categoryId",
                            element: <Category />,
                        },
                        {
                            path: "match/:matchId",
                            element: <Match />
                        }
                    ]
                },
            ]
        }
    ]);

    return <RouterProvider router={router} />;
}