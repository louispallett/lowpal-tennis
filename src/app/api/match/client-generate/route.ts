import { connectToDB } from "@/lib/db";
import { generateMatches } from "@/lib/generateMatches";
import HttpError from "@/lib/HttpError";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PostValidation = z.object({
    players: z.array(z.string().trim().max(200))
})


export async function POST(req:NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const parsed = PostValidation.safeParse(body);
        if(!parsed.success) {
            console.error(parsed.error.flatten().fieldErrors);
            return NextResponse.json({
                message: "Validation Errors",
                errors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const { players } = parsed.data;

        const matches = generateMatches(players);

        // The total number of matches must equal the number of players - 1. This is a fail-safe in case it doesn't.
        if (matches.length != players.length - 1) {
            const error = "Error generating matches. Code: client-generate-GET/array-size-is-unexpected";
            console.error(error);
            throw new HttpError(error, 500);
        }

        return NextResponse.json({ matches });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}