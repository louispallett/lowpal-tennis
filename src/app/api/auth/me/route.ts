import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToDB } from "@/lib/db";

export async function GET(req:NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    try {
        await connectToDB();

        // This '!' is a TS non-null assertion operator (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html)
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!); 
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
}
