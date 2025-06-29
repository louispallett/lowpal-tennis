import HttpError from "@/lib/HttpError";
import { getPlayersByCategory } from "@/lib/players";
import { createMixedTeams, createTeams } from "@/lib/createTeams";
import { PlayerType } from "@/lib/types";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import objectIdSchema from "../../objectIdSchema";

const GetValidation = z.object({
    categoryIdSafe: objectIdSchema
});

const extractIds = (players:PlayerType[]):string[] => {
    const result:string[] = [];
    for (const player of players) {
        result.push(player._id);
    }
    return result;
}

export async function GET(
    req:Request,
    { params }: { params: { categoryId:string }}
) {
    const { categoryId } = await params;
    const parsed = GetValidation.safeParse({ categoryIdSafe: categoryId });
    if (!parsed.success) throw new HttpError(parsed.error.message, 400);
    const { categoryIdSafe } = parsed.data;

    const category = await Category.findById(categoryId);
    const players = await getPlayersByCategory(categoryId);

    const seeded = players.filter(x => x.seeded);
    const nonSeeded = players.filter(x => !x.seeded)
    let newTeams:string[][] = [];

    if (category.name === "Mixed Doubles") {
        let maleSeeded = seeded.filter(x => x.male);
        let femaleSeeded = seeded.filter(x => !x.male);
        let maleNonSeeded = nonSeeded.filter(x => x.male);
        let femaleNonSeeded = nonSeeded.filter(x => !x.male);
        newTeams = createMixedTeams(
            extractIds(maleSeeded),
            extractIds(maleNonSeeded), 
            extractIds(femaleSeeded), 
            extractIds(femaleNonSeeded),
        );
    } else {
        newTeams = createTeams(extractIds(seeded), extractIds(nonSeeded));
    }

    return NextResponse.json(newTeams, { status: 200 });
}