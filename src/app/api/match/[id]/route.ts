import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import Match from "@/models/Match";
import { NextResponse } from "next/server";
import { z } from "zod";
import objectIdSchema from "../../objectIdSchema";

//? z.union() allows either case in the array
const scoresSchema = z.union([
    z.record(objectIdSchema, z.array(z.string().trim())), 
    z.object({}).strict() 
]);

const PutValidation = z.object({
    matchId: objectIdSchema,
    matchData: z.object({
        winner: objectIdSchema,
        scores: scoresSchema
    })
});

export async function PUT(req:Request, { params }: { params: { id:string } }) {
    try {
        await connectToDB();
        const { id } = await params;
        const body = await req.json();

        const parsed = PutValidation.safeParse({ 
            matchId: id, 
            matchData: body.data 
        });
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);

        const { matchId, matchData } = parsed.data;

        const currentMatch = await Match.findById(matchId);
        if (currentMatch.nextMatchId) {
            const nextMatch = await Match.findById(currentMatch.nextMatchId);
    
            // Push winner to nextMatch
            const nextMatchParticipants = [];
            const nextPlayer = nextMatch.participants.find(p => !p._id.equals(currentMatch.participants[0] || !p._id.equals(currentMatch.participants[1])));
            const winner = currentMatch.participants.find(p => p._id.equals(matchData.winner))
            if (!winner) {
                throw new HttpError("Winner " + matchData.winner + " not found.", 400);
            }
            winner.resultText = "";
            if (nextPlayer) nextMatchParticipants.push(nextPlayer);
            nextMatchParticipants.push(winner);

            await Match.updateOne(
                { _id: nextMatch._id },
                { $set: { participants: nextMatchParticipants } }
            )
        }
        
        const currentMatchParticipants = [];
        if (Object.keys(matchData.scores).length === 0) {
            //? We have a walkover
            const winner = currentMatch.participants.find(p => p._id.equals(matchData.winner));
            if (!winner) throw new HttpError("Winner " + matchData.winner + " not found.", 400);
            winner.resultText = "W/O"
            winner.status = "PLAYED";
            winner.isWinner = true;
            const loser = currentMatch.participants.find(p => !p._id.equals(matchData.winner));
            loser.status = "PLAYED";
            currentMatchParticipants.push(winner, loser);
        } else {
            //? Non-walkover
            for (const participant in matchData.scores) {
                const player = currentMatch.participants.find(p => p._id.equals(participant));
                if (!player) throw new HttpError("Player " + participant + " not found.", 400);
                const playerScore = matchData.scores[participant].join("-");
                player.resultText = playerScore;
                currentMatchParticipants.push(player);
            }
        }

        await Match.updateOne(
            { _id: currentMatch._id },
            { $set: { 
                participants: currentMatchParticipants,
                state: "SCORE_DONE"
            }}
        );
        
        return NextResponse.json({}, { status: 200 });
    } catch (err:any) {
        console.log(err.message);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}