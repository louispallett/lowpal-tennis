"use client"

import { ArrowLeftStartOnRectangleIcon, Bars3Icon, HomeIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const [isPending, setIsPending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const handleLogOut = () => {
        setIsPending(true);
        axios.post("/api/auth/logout", {})
            .then(() => {})
            .finally(() => {
                window.location.reload();
            })
    }

    return (
        <section className="header">
            <div className="header-inner">
                <div>
                    <Link href="/dashboard" >
                        <div className="flex items-center">
                            <div className="racket-cross-wrapper-sm">
                                <img src="/assets/images/racket-red.svg" alt="" />
                                <img src="/assets/images/racket-blue.svg" alt="" />
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="sm:hidden sm:relative">
                    <Bars3Icon className="h-8 m-5 cursor-pointer" 
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    { isOpen && (
                        <Menu onClose = {() => setIsOpen(false)} handleLogOut={handleLogOut} />
                    )}
                </div>
                <div className="hidden sm:flex h-full justify-end font-semibold">
                    <Link className="menu-link" href="/dashboard">
                        <p>Dashboard</p>
                    </Link>
                    <Link className="menu-link" href="/dashboard/account">
                        <p>Account</p>
                    </Link>
                    <button className="menu-link" onClick={handleLogOut}>
                        <p>Log Out</p>
                    </button>
                </div>
            </div>
        </section>
    )
}

type MenuProps = {
    onClose: () => void;
    handleLogOut: () => void;
}

function Menu({ onClose, handleLogOut }:MenuProps) {
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
                onClose();
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }
        document.addEventListener("keydown", handleKeyDown);

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={menuRef}
            className="absolute! top-12 right-12 z-30 w-48! p-0! standard-container-no-shadow bg-indigo-500 text-white"
        >
            <div className="flex flex-col">
                <Link href="/dashboard" className="flex gap-2.5 p-1.5 hover:bg-indigo-800">
                    <HomeIcon className="w-6" />
                    <p>Dashboard</p>
                </Link>
                <Link href="/dashboard/account" className="flex gap-2.5 p-1.5 hover:bg-indigo-800">
                    <UserCircleIcon className="w-6" />
                    <p>Account</p>
                </Link>
                <button className="flex gap-2.5 cursor-pointer p-1.5 hover:bg-indigo-800"
                    onClick={handleLogOut}
                >
                    <ArrowLeftStartOnRectangleIcon className="w-6" />
                    <p>Log Out</p>
                </button>
            </div>
        </div>
    )
}