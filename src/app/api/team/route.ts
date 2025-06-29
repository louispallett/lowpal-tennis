import HttpError from "@/lib/HttpError";
import Team from "@/models/Team";
import { NextResponse } from "next/server";
import { z } from "zod";
import objectIdSchema from "../objectIdSchema";

const PlayerSchema = z.object({
    _id: objectIdSchema,
    tournament: objectIdSchema,
    user: z.object({
        firstName: z.string(),
        lastName: z.string(),
    }),
    male: z.boolean(),
    categories: z.array(objectIdSchema),
    seeded: z.boolean(),
    ranking: z.number(),
});

const TeamSchema = z.object({
    tournament: objectIdSchema,
    category: objectIdSchema,
    players: z.array(PlayerSchema).length(2), 
    ranking: z.number(),
});


const PostValidation = z.object({
    teams: z.array(TeamSchema),
});

export async function POST(req:Request) {
    try {
        const body = await req.json();
        
        const parsed = PostValidation.safeParse({ teams: body.teams });
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);
        const { teams } = parsed.data;
        
        const promises = teams.map((team:any) => {
            const newTeam = new Team(team);
            return newTeam.save();
        });

        const savedTeams = await Promise.all(promises);

        return NextResponse.json(savedTeams, { status: 200 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}