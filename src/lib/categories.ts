import Category from "@/models/Category";
import { CategoryType } from "./types";
import { connectToDB } from "./db";
import HttpError from "./HttpError";
import { Types } from "mongoose";

export async function getCategoryInfo(categoryId:string):Promise<CategoryType> {
    await connectToDB();
    const category = await Category.findById(categoryId);

    if (!category) {
        throw new HttpError("Category not found", 404);
    }

    return category;
}

export async function getCategoriesByTournament(tournamentId:string):Promise<CategoryType[]> {
    await connectToDB();
    const categories = await Category.find({ tournament: tournamentId });
    return categories;
}

export async function getPlayerCategories(categoryIds:Types.ObjectId[] | CategoryType[]):Promise<CategoryType[]> {
    await connectToDB();
    const categories:CategoryType[] = [];
    for (const category of categoryIds) {
        const playerCategory = await Category.findById(category);
        categories.push(playerCategory);
    }

    return categories;
}