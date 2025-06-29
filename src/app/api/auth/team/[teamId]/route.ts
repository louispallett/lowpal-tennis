import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import Player from "@/models/Player";
import Team from "@/models/Team";
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

export async function GET(request:NextRequest, { params }: { params: { teamId:string }}) {
    try {
        await connectToDB();
        const { teamId } = await params;
        const parsed = GetValidation.safeParse(teamId);
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);

        const teamIdSafe = parsed.data;
        const team = await Team.findById(teamIdSafe);
        const player1 = await Player.findById(team.players[0]._id);
        const player2 = await Player.findById(team.players[1]._id);
        const user1 = await User.findById(player1.user)
            .select("firstName lastName mobCode mobile");
        const user2 = await User.findById(player2.user)
            .select("firstName lastName mobCode mobile");

        const users = [user1, user2];
        return NextResponse.json(users, { status: 200 });
    } catch (err:any) {
        console.log(err.message);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}