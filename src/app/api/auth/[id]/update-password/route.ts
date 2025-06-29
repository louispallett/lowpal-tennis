import objectIdSchema from "@/app/api/objectIdSchema";
import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PutValidation = z.object({
    userId: objectIdSchema,
    data: z.object({
        currentPassword: z.string().trim().min(1).max(50),
        newPassword: z.string().trim().min(8).max(200).refine((val) =>
            /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val),
            {
                message: "Password must include upper/lowercase, number, and symbol",
            }
        )
    })
})


export async function PUT(req:NextRequest, { params }: { params: { id:string }}) {
    try {
        await connectToDB();

        const body = await req.json();

        const { id } = await params;
        const parsed = PutValidation.safeParse({ userId: id, data: body.data })
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);
        const { userId, data } = parsed.data;

        const user = await User.findById(userId);
        if (!user) throw new HttpError("User not found", 400);

        const correctPassword = await bcrypt.compare(data.currentPassword, user.password);
        if (!correctPassword) {
            return NextResponse.json({ message: "Incorrect Current Password" }, { status: 401 });
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 12);

        await User.updateOne(
            { _id : userId },
            { password: hashedPassword }
        );

        return new NextResponse(null, { status: 204 })
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}