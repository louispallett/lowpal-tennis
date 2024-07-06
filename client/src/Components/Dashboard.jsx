import { Link, Outlet } from 'react-router-dom';

import { BackgroundContainer, HeaderContainer, HeaderContainerInner } from './tailwind_components/tailwind-containers';

export default function App() {

    const handleLogOut = () => {
      localStorage.clear();
      window.location.assign("/users/sign-in")
    }
    
    return (
    <BackgroundContainer >
      <HeaderContainer>
        <HeaderContainerInner>
            <div>
            <Link to="/dashboard/articles/" >
                <div className="flex flex-col">
                    <h1 id="subtitle" className="relative font-kanit text-base sm:text-2xl text-white">2024 SLTC</h1>
                </div>
                <h1 id="main-title" className="text-lg font-kanit sm:text-2xl text-white">In-House Tournament</h1>
            </Link>
            </div>
            <ul className="list-none flex items-center gap-2.5 text-sm sm:gap-5 font-bold sm:text-lg text-slate-100">
                <Link to="/dashboard/categories" className="py-5 hover:text-lime-300">
                <li>Matches</li>
                </Link>
                <Link to="/brackets" className="py-5 hover:text-lime-300">
                <li>Results</li>
                </Link>
                <Link to="/dashboard/about" className="py-5 hover:text-lime-300">
                <li>Guide</li>
                </Link>
                <button onClick={handleLogOut} className="py-5 font-bold hover:text-lime-300">Log Out</button>
            </ul>
        </HeaderContainerInner>
      </HeaderContainer>
      <div className="grid justify-center max-w-full">
        <Outlet />
      </div>
      <footer className="flex px-3 py-3 justify-between items-center rounded-lg shadow m-4 bg-indigo-600 text-white sm:px-5">
        <div>
          <a href="https://github.com/louispallett/odin-blog-api">
            <p className="font-bold text-xs py-5 sm:text-sm hover:text-lime-300">© 2024 LowPal, The Odin Project</p>
          </a>
        </div>
      </footer>
    </ BackgroundContainer>
    );
};  