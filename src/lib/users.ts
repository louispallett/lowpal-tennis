import User from "@/models/User";
import { connectToDB } from "./db";
import HttpError from "./HttpError";
import { UserType } from "./types";

export async function getUserById(userId:string):Promise<UserType> {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
        throw new HttpError("User not found", 400);
    }

    return user;
}