import Link from "next/link";
import Header from "./Header";

export default function HomeLayout({
    children
} : {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main 
                className="flex-1 mx-2.5 md:mx-8 lg:mx-16 2xl:mx-36 flex flex-col my-16"
            >{children}</main>
            <Footer />
        </div>
    )
}

function Footer() {
    return (
      <footer>
        <div>          
            <p className="font-bold text-xs sm:text-sm">© 2024 LowPal/Louis Nicholson-Pallett</p>
        </div>
        <div className="text-right">
            <a href="https://github.com/louispallett/lowpal-tennis/">
                <p className="text-click text-xs">See it on GitHub</p>
            </a>
            <Link href="/users/using-your-data" target="_blank" rel="noopener noreferrer" >
                <p className="text-click text-xs">Data & Privacy Policy</p>
            </Link>
        </div>
      </footer>
    )
}