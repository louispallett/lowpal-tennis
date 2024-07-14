import { Outlet } from "react-router-dom"
import tennisBall from "/assets/images/tennis-ball.svg";
import { BackgroundContainerCentre, UsersContainer } from "../tailwind_components/tailwind-containers";


export default function Users() {
    return (
        <BackgroundContainerCentre>
            <UsersContainer>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 max-sm:px-0">
                    <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                        <div className="flex justify-center gap-5 items-center">
                            <img src={tennisBall} alt="" className="h-10" id="spinner" />
                            <h1 className="font-poppins text-3xl font-bold tracking-tight text-nowrap max-sm:text-wrap dark:text-white">Saltford Lawn Tennis Club</h1>
                        </div>
                        <h2 className="font-poppins text-center text-xl leading-9 tracking-tight text-gray-900 dark:text-white">2024 In-House Tournament</h2>
                    </div>
                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-lg">
                        <Outlet />
                    </div>
                </div>
            </UsersContainer>
        </BackgroundContainerCentre>
    )
}