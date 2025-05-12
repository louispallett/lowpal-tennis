import { Link, Outlet } from "react-router-dom";

export default function App() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* <Header /> */}
            <div className="flex flex-1 mt-8">
                <div className="app-wrapper">
                    <Outlet />
                </div>
            </div>  
            <Footer />
        </div>
    )
}

function Header() {
    return (
        <section className="header">
            <div className="header-inner">
                <div className="font-semibold px-5">
                    <Link to="/" >
                        <div className="flex flex-col">
                            <h3 className="hidden font-popcorn text-right sm:text-2xl md:block">LowPal Tennis</h3>
                        </div>
                    </Link>
                </div>
                <div className="flex h-full justify-end font-semibold">
                    <Link className="menu-link" to="/">
                        <p>Home</p>
                    </Link>
                    <Link className="menu-link" to="/about">
                        <p>About</p>
                    </Link>
                    <Link className="menu-link" to="/users/sign-in">
                        <p>Login</p>
                    </Link>
                </div>
            </div>
        </section>
    )
}

function Footer() {
    return (
      <footer>
        <div>          
            <p className="font-bold text-xs sm:text-sm text-slate-700">© 2024 LowPal/Louis Nicholson-Pallett</p>
        </div>
        <div className="text-right">
            <a href="https://github.com/louispallett/lowpal-tennis/">
                <p className="text-click text-slate-700 text-xs">See it on GitHub</p>
            </a>
            <Link to="/users/using-your-data" target="_blank" rel="noopener noreferrer" >
                <p className="text-click text-slate-700 text-xs">Data & Privacy Policy</p>
            </Link>
        </div>
      </footer>
    )
}