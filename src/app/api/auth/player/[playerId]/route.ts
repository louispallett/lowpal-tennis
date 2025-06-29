import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import Player from "@/models/Player";
import User from "@/models/User";
import { connect } from "http2";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const GetValidation = z.string().trim().refine(
    (v) => mongoose.Types.ObjectId.isValid(v), {
        message: "Invalid category ID"
    }
)

export async function GET(request:NextRequest, { params }: { params: { playerId:string }}) {
    try {
        await connectToDB();
        const { playerId } = await params;
        const parsed = GetValidation.safeParse(playerId);
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);

        const playerIdSafe = parsed.data;
        const player = await Player.findById(playerIdSafe);
        const user = await User.findById(player.user)
            .select("firstName lastName mobCode mobile");

        return NextResponse.json(user, { status: 200 });
    } catch (err:any) {
        console.log(err.message);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}