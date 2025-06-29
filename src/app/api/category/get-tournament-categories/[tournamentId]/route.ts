import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const GetValidation = z.string().trim().refine(
    (v) => mongoose.Types.ObjectId.isValid(v), {
        message: "Invalid category ID"
    }
)

export async function GET(request:NextRequest, { params }: { params: { tournamentId:string } }) {
    try {
        await connectToDB();
        const { tournamentId } = await params;
        const parsed = GetValidation.safeParse(tournamentId);
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);

        const tournamentIdSafe = parsed.data;

        const tournamentCategories = await Category.find({ tournament: tournamentIdSafe });

        const categories = [];
        for (let obj of tournamentCategories) {
            categories.push(obj.name);
        }

        return NextResponse.json(categories, { status: 200 });
    } catch (err:any) {
        console.log(err.message);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}