import Link from "next/link";

export default function HomeLayout({
    children
} : {
    children: React.ReactNode;
}) {
    return (
        <div className="py-8">
            <div className="mb-4">
                <div className="w-full flex flex-col">
                    <Link href="/">
                        <div className="title-wrapper space-y-2 text-center">
                            <h2 className="main-title-sm fade-in delay-0 translate-x-[2.5%]">Tennis</h2>
                            <h2 className="main-title-sm fade-in delay-1 translate-x-[-2.5%]">Tournament</h2>
                            <h2 className="main-title-sm fade-in delay-2 translate-x-[7.5%]">Creator</h2>
                        </div>
                    </Link>
                    <div className="racket-cross-wrapper">
                        <img src="/assets/images/racket-red.svg" alt="" />
                        <img src="/assets/images/racket-blue.svg" alt="" />
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="standard-container form-wrapper">
                    <main>{children}</main>
                </div>
            </div>
        </div>
    )
}