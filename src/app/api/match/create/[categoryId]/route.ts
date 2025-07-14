import objectIdSchema from "@/app/api/objectIdSchema";
import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import Category from "@/models/Category";
import Match from "@/models/Match";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//? Having both user and players as optional allows us to use this for both teams and players (doubles and singles)
const ParticipantValidation = z.object({
    _id: z.string().trim(),
    user: z.object({
        firstName: z.string().trim().max(50),
        lastName: z.string().trim().max(50),
    }).optional(),
    players: z.array(z.object({
        user: z.object({
            firstName: z.string().trim().max(50),
            lastName: z.string().trim().max(50),
        })
    })).optional()
})

const MatchValidation = z.object({
    _id: objectIdSchema,
    participants: z.array(ParticipantValidation),
    tournamentRoundText: z.string().trim().max(20),
    nextMatchId: objectIdSchema.nullable(),
    qualifyingMatch: z.boolean(),
    previousMatchId: z.array(objectIdSchema).optional(),
});


const PostValidation = z.object({
    categoryIdSafe: objectIdSchema,
    matches: z.array(MatchValidation).min(1, { message: "At least one match is required" }),
    dates: z.record(z.coerce.date()),
});

export async function POST(req:NextRequest, { params }: { params: { categoryId:string }}) {
    try {
        await connectToDB();

        const body = await req.json();
        const { categoryId } = await params;

        const parsed = PostValidation.safeParse({ 
            categoryIdSafe: categoryId, 
            matches: body.matches, 
            dates: body.data 
        });
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);
        const { categoryIdSafe, matches, dates } = parsed.data;

        const matchesExist = await Match.findOne({ category: categoryIdSafe });
        if (matchesExist) throw new HttpError("Matches for this category have already been created", 401);

        const categoryInfo = await Category.findById(categoryIdSafe);

        for (let match of matches) {
            match.participants = match.participants.map((participant) => {
                const newParticipant = {
                    participantId: "",
                    participantModel: "",
                    name: ""
                };
                if (categoryInfo.doubles) {
                    newParticipant.participantId = participant._id,
                    newParticipant.participantModel = "Team",
                    newParticipant.name = `${participant.players![0].user.firstName} ${participant.players![0].user.lastName} and ${participant.players![1].user.firstName} ${participant.players![1].user.lastName}`
                } else {
                    newParticipant.participantId = participant._id,
                    newParticipant.participantModel = "Player",
                    newParticipant.name = `${participant.user!.firstName} ${participant.user!.lastName}`
                }
                return newParticipant;
            });
        }

        const savedMatches = await Promise.all(matches.map(async (match) => {
            const newMatch = new Match({
                ...match,
                tournament: categoryInfo.tournament,
                category: categoryIdSafe,
                date: dates[Number(match.tournamentRoundText)]
            });
            return newMatch.save();
        }));

        await Category.updateOne(
            { _id: categoryIdSafe },
            { locked: true }
        );
        
        return NextResponse.json(savedMatches, { status: 201 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}