import { Link, Outlet } from "react-router-dom";

export default function Main() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Header />
            <div className="flex flex-1 mt-8">
                <div className="grid flex-1 min-h-full max-w-full max-w-screen-3xl font-roboto">
                    <Outlet />
                </div>
            </div>  
            <Footer />
        </div>
    )
}

function Header() {

    const handleLogOut = () => {
        localStorage.clear();
        window.location.assign("/users/sign-in")
    }

    return (
        <section className="header">
            <div className="header-inner">
                <div className="font-semibold p-2.5 px-5">
                    <Link to="/main" >
                        <div className="flex flex-col">
                            <h3 className="hidden font-mania text-right sm:text-2xl md:block">LowPal Tennis</h3>
                        </div>
                    </Link>
                </div>
                <div className="flex h-full justify-end font-semibold">
                    <Link className="menu-link" to="/main">
                        <p>Dashboard</p>
                    </Link>
                    <Link className="menu-link" to="/users/account-settings">
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

function Footer() {
    return (
      <footer className="w-full flex px-3 py-3 justify-between items-center rounded-lg m-1 my-2 sm:px-5">
        <div>          
            <p className="font-bold text-xs py-5 sm:text-sm text-slate-700">© 2024 LowPal/Louis Nicholson-Pallett</p>
        </div>
        <div className="text-right">
            <a href="https://github.com/louispallett/lowpal-tennis/">
                <p className="text-click text-slate-700">See it on GitHub</p>
            </a>
            <Link to="/users/using-your-data" target="_blank" rel="noopener noreferrer" >
                <p className="text-click text-slate-700">Data & Privacy Policy</p>
            </Link>
        </div>
      </footer>
    )
}