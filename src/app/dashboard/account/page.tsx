import UpdatePersonalDetailsForm from "./UpdatePersonalDetailsForm"
import UpdatePasswordForm from "./UpdatePasswordForm"

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/users";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function Account() {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const { payload } = await jwtVerify(token!, JWT_SECRET);
    const userId:any = payload.userId;
    const user = await getUserById(userId);
    const userClient = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobCode: user.mobCode,
        mobile: user.mobile
    }

    return (
        <div className="flex flex-col gap-2.5 sm:mx-1.5 lg:mx-5">
            <div className="standard-container container-lime">
                <h3 className="main-title-sm">Account Settings</h3>
            </div>
            <UpdatePersonalDetailsForm details={JSON.parse(JSON.stringify(userClient))} />
            <UpdatePasswordForm userId={JSON.parse(JSON.stringify(user._id))} />
        </div>
    )
}