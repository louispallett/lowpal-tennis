import { Link } from "react-router-dom";

export default function Finals() {
    // h-1/2 md:h-5/6
    return (
        <>
            <section className="text-slate-50">
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
            <div className="flex flex-col gap-2.5 p-2.5 border-2 border-slate-950 dark:border-slate-100 bg-green-600 bg-opacity-80">
                <h2 className="text-xl sm:text-4xl md:text-6xl text-center my-2.5 font-mania">Finals Weekend</h2>
            </div>
            <div className="hidden md:block flex flex-col gap-2.5 border-2 border-slate-950 dark:border-slate-100 bg-indigo-600 bg-opacity-80">
                <h2 className="text-lg sm:text-xl md:text-2xl text-center my-1.5">Come and watch the finals to the 2024 In-House Tournament!</h2>
            </div>
        </div>
	)
}

function Info() {
	return (
        <div className="flex flex-col gap-2.5">
            <div className="hidden md:block p-2.5 border-2 border-slate-100 bg-green-600 bg-opacity-80">
                <h2 className="text-xl sm:text-2xl md:text-4xl text-center my-2.5">Schedule</h2>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-col gap-1.5 flex-1 lg:grid grid-cols-2 md:gap-5 md:my-2.5 md:m-10 text-center">
                    <div className="border-2 border-slate-50 rounded-md md:min-w-96 border-2 border-slate-100 bg-indigo-600 bg-opacity-80">
                        <div className="p-2.5">
                            <h4 className="text-lg text-center font-bold">Saturday (14:00 - 17:00)</h4>
                            <hr className="my-2.5"/>
                            <div className="flex flex-col gap-2.5">
                                <div>
                                    <p><b>14:30, Court 1</b></p>
                                    <p><b><i>Womens Singles</i></b></p>
                                    <p>Katie Robson vs. (Milly Allen <b>OR</b> Lou Bessell)</p>
                                </div>
                                <hr className="mx-5"/>
                                <div>
                                    <p><b>15:30, Court 3</b></p>
                                    <p><b><i>Mens Singles</i></b></p>
                                    <p>Tom Warren vs. Norman Hui</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 border-slate-50 rounded-md md:min-w-96 border-2 border-slate-100 bg-indigo-600 bg-opacity-80">
                        <div className="p-2.5">
                            <h4 className="text-lg text-center font-bold">Sunday (10:30 - 17:00)</h4>
                            <hr className="my-2.5"/>
                            <div className="flex flex-col gap-2.5">
                                <div>
                                    <p><b>11:00, Court 1</b></p>
                                    <p><b><i>Womens Doubles</i></b></p>
                                    <p>Katie Robson and Claire Pugh vs. Milly Allen and Kath Wilson</p>
                                </div>
                                <hr className="mx-5"/>
                                <div>
                                    <p><b>11:00, Court 3</b></p>
                                    <p><b><i>Mens Doubles</i></b></p>
                                    <p>Simon Stent and Jonathan Harwood vs. Tom Warren and Dave Perryman</p>
                                </div>
                                <hr className="mx-5"/>
                                <div>
                                    <p><b>13:30, Court 2</b></p>
                                    <p><b><i>Mixed Doubles</i></b></p>
                                    <p>John Moruzzi and Katie Robson vs. Lucas Richards and Kath Wilson</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	)
}