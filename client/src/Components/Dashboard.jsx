import { Link, Outlet } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon, HomeIcon, ChartBarIcon, PaperClipIcon, ScaleIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";

import { BackgroundContainer, HeaderContainer, HeaderContainerInner } from "./tailwind_components/tailwind-containers";
import { useEffect, useState } from "react";

export default function Dashboard() {    
  return (
    <BackgroundContainer >
      <HeaderContainer>
        <HeaderContainerInner>
            <div>
              <Link to="/dashboard" >
                  <div className="flex flex-col">
                      <h1 id="subtitle" className="relative font-sedan text-base sm:text-2xl text-slate-100">2024 SLTC</h1>
                  </div>
                  <h1 id="main-title" className="text-lg font-sedan sm:text-2xl text-slate-100">In-House Tournament</h1>
              </Link>
            </div>
            <Navigation />
            </HeaderContainerInner>
      </HeaderContainer>
      <div className="flex flex-1 justify-center">
        <div className="grid justify-center max-w-full max-w-screen-3xl">
          <Outlet />
        </div>
      </div>   
      <Footer />
    </ BackgroundContainer>
  );
};

function Navigation() {
  const [userData, setUserData] = useState(null);

  const handleLogOut = () => {
    localStorage.clear();
    window.location.assign("/users/sign-in")
  }

  useEffect(() => {
    const getUserEmail = async () => {
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
          const data = await response.json();
          setUserData({ email: data.email, firstName: data.firstName, lastName: data.lastName });
        } else {
          setUserData(false);
        }
      } catch (err) {
          console.log(err)
      }
    }
    getUserEmail();
  }, [])

  return (
    <Menu as="div" className="relative inline-block text-left shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
      <Menu.Button className="inline-flex items-center gap-2 rounded-md bg-lime-600 py-1.5 px-3 font-bold text-white focus:outline-none hover:bg-lime-500 transition-all">
          Menu
          <ChevronDownIcon className="w-4 h-6 fill-white/60" />
      </Menu.Button>
      <Menu.Items transition="true" className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition dark:bg-slate-800 focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
          <Menu.Item>
            <p className="block px-4 py-2 text-gray-700 dark:text-slate-100">Signed in as <b>{userData ? userData.email : ""}</b></p>
          </Menu.Item>
          <div className="px-2.5">
            <hr />
          </div>
          <Menu.Item className="flex gap-1.5 items-center items-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <Link to="/dashboard" className="block px-4 py-2 text-gray-700 dark:text-slate-100">
              <HomeIcon className="w-4 h-6 fill-slate/60"/>
              My Matches</Link>
          </Menu.Item>
          <Menu.Item className="flex gap-1.5 items-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <Link to="/dashboard/brackets" className="block px-4 py-2 text-gray-700 dark:text-slate-100">
            <ChartBarIcon className="w-4 h-6 fill-slate/60"/>
            Results</Link>
          </Menu.Item>
          <Menu.Item className="flex gap-1.5 items-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <Link to="/dashboard/about" className="block px-4 py-2 text-gray-700 dark:text-slate-100">
            <PaperClipIcon className="w-4 h-6 fill-slate/60"/>
            Site Guide</Link>
          </Menu.Item>
          <Menu.Item className="flex gap-1.5 items-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <Link to="/dashboard/rules" className="block px-4 py-2 text-gray-700 dark:text-slate-100">
            <ScaleIcon className="w-4 h-6 fill-slate/60"/>
            Tournament Rules</Link>
          </Menu.Item>
          <Menu.Item className="flex gap-1.5 items-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all w-full text-left">
            <button onClick={handleLogOut} className="block px-4 py-2 text-gray-700 font-black dark:text-slate-100 rounded-md rounded-t-none">
            <ArrowLeftStartOnRectangleIcon className="w-4 h-6 fill-slate/60" />
            Log Out</button>
          </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

function Footer() {
  return (
    <footer className="flex px-3 py-3 justify-between items-center rounded-lg m-1 my-2 bg-indigo-600 text-white sm:px-5 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
      <div>
        <a href="https://github.com/louispallett/odin-blog-api">
          <p className="font-bold text-xs py-5 sm:text-sm hover:text-lime-300">© 2024 LowPal/Louis Nicholson-Pallett</p>
        </a>
      </div>
      <Link to="/users/using-your-data" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-right hover:text-lime-500 transition-all" >
        Data & Privacy Policy
      </Link>
    </footer>
  )
}