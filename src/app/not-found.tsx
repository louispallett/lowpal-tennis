import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="standard-container p-5! bg-indigo-500 w-auto! text-white">
                <h2 className="main-title-sm">404 - Not Found</h2>
                <p className="text-lg my-5">
                    Sorry, it looks like the page you are trying to access cannot be found.
                </p>
                <Link className="success shadow-none! mb-5" href="/">Return Home</Link>
            </div>
        </div>
    )
}