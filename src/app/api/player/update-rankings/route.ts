import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import Player from "@/models/Player";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"

const PutValidation = z.array(z.object({
    id: z.string().trim().refine(
        (v) => mongoose.Types.ObjectId.isValid(v), {
            message: "Invalid player ID"
        }
    ),
    ranking: z.number()
}));

export async function PUT(req:NextRequest) {
    try {
        await connectToDB();
        
        const body = await req.json();
        const data = [];
        for (let player in body) {
            data.push({
                id: player,
                ranking: Number(body[player])
            });
        }
        const parsed = PutValidation.safeParse(data);
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);
        const parsedData = parsed.data;

        const promises = [];
        for (let player of parsedData) {
            const promise = Player.updateOne(
                { _id: player.id },
                { $set: { ranking: player.ranking }}
            );
            promises.push(promise);
        }

        await Promise.all(promises);

        return new NextResponse(null, { status: 204 });
    } catch (err:any) {
        console.log(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}