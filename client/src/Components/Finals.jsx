import { Link } from "react-router-dom";

export default function Finals() {
    // h-1/2 md:h-5/6
    return (
        <>
            <section className="w-screen text-slate-50">
                <div className="flex flex-col justify-between p-2.5 sm:p-5 text-sm sm:text-base w-screen h-screen border-slate-50 border-2" id="finals-container">
                    <Title />
                    <Info />
                </div>
            </section>
        </>
    )
}

function Title() {
	return (
        <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-2.5 p-2.5 border-2 border-slate-950 dark:border-slate-100 bg-green-600 bg-opacity-70 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                <h2 className="text-xl sm:text-4xl md:text-6xl text-center my-2.5 font-mania">Finals Weekend</h2>
            </div>
            <div className="flex flex-col gap-2.5 border-2 border-slate-950 dark:border-slate-100 bg-indigo-600 bg-opacity-70 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                <h2 className="text-lg sm:text-xl md:text-2xl text-center my-1.5">Come and watch the finals to the 2024 In-House Tournament!</h2>
            </div>
        </div>
	)
}

function Info() {
	return (
        <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-2.5 p-2.5 border-2 border-slate-950 dark:border-slate-100 bg-green-600 bg-opacity-70 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                <h2 className="text-xl sm:text-2xl md:text-4xl text-center my-2.5">Schedule</h2>
            </div>
            <div className="flex justify-center border-2 border-slate-950 dark:border-slate-100 bg-indigo-600 bg-opacity-70 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                <div className="sm:grid grid-cols-2 gap-5 my-2.5 m-10">
                    <div className="border-2 border-slate-50 rounded-md">
                        <div className="p-2.5">
                            <h4 className="text-lg text-center font-bold">Saturday (13:00 - 17:00)</h4>
                            <p><b>Schedule</b></p>
                            <p>The lives of the Romans lasted for over two thousand years. First, as part of the republic, then as part of the empire over the Mediterranian, and then later through the Byzantine Empire in Constantinople and the East.</p>
                        </div>
                    </div>
                    <div className="border-2 border-slate-50 rounded-md">
                        <div className="p-2.5">
                            <h4 className="text-lg text-center font-bold">Sunday</h4>
                            <p><b>Schedule</b></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	)
}