import HttpError from "@/lib/HttpError";
import { MatchType } from "@/lib/types";
import Match from "@/models/Match";
import Tournament from "@/models/Tournament";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

const PutValidation = z.object({
    tournamentId: z.string().trim().refine(
        (v) => mongoose.Types.ObjectId.isValid(v), {
            message: "Invalid tournament ID"
        }
    )
});

const tournamentStages = ["sign-up", "draw", "play", "finished"];

const checkPlayInvalid = (matches:MatchType[]):boolean => {
    const activeMatches = matches.filter(v => v.state === "SCHEDULED");
    return activeMatches.length > 0;
}

export async function PUT(
    req:Request,
    { params }: { params: { id:string }}
) {
    try {
        const { id } = await params;
        const parsed = PutValidation.safeParse({ tournamentId: id });
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);

        const { tournamentId } = parsed.data;
        const tournament = await Tournament.findById(tournamentId);
        const stageIndex = tournamentStages.indexOf(tournament.stage);

        if (tournament.stage === "play") {
            const matches = await Match.find({ tournament: tournamentId });
            if (checkPlayInvalid(matches)) {
                throw new HttpError("There are still active matches in this tournament", 200);
            }
        }

        if (!tournamentStages[stageIndex + 1]) throw new HttpError("Stage out of bounds", 400);

        await Tournament.updateOne(
            { _id: tournamentId },
            { stage: tournamentStages[stageIndex + 1] }
        );

        return new NextResponse(null, { status: 204 });
    } catch (err:any) {
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}