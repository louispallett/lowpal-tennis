import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import Users from "./Users/Users";
import SignIn from "./Users/SignIn";
import SignUp from "./Users/SignUp";
import Dashboard from "./Dashboard";
import Categories from "./Categories";
import Match from "./Match";

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
                    headers: { "Authorization": `${token}`} 
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
            element: isAuth ? <Navigate to="/dashboard" replace /> : <Navigate to="/users/sign-in" />
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
        {
            path: "/dashboard",
            element: <Dashboard />,
            children: [
                {
                    path: "about",
                    element: <Categories />
                },
                {
                    path: "categories",
                    element: <Categories />
                },
            ]
        }
    ]);

    return <RouterProvider router={router} />;
}