import Player from "@/models/Player";
import Team from "@/models/Team";
import User from "@/models/User";
import { TeamType, TeamTypeClient } from "./types";
import { connectToDB } from "./db";
import Category from "@/models/Category";

export async function getTeam(teamId:string):Promise<TeamType> {
    await connectToDB();
    const team = await Team.findById(teamId)
        .populate({ path: "players", model: Player, 
            populate: [{
                path: "user",
                select: "-password",
                model: User
            }]
        });
    return team;
}

export async function getTeamsByTournament(tournamentId:string):Promise<TeamType[]> {
    await connectToDB();
    const teams = await Team.find({ tournament: tournamentId }).sort("ranking");
    return teams;
}

export async function getTeamsByCategory(categoryId:string):Promise<TeamType[]> {
    await connectToDB();
    const teams = await Team.find({ category: categoryId })
        .populate({ path: "players", model: Player, 
            populate: [{
                path: "user",
                select: "-password",
                model: User
            }]
        }).sort("ranking");

    return teams;
}

export async function getUserTeams(playerId:string):Promise<TeamType[]> {
    await connectToDB();
    const teams = await Team.find({ players: playerId })
        .populate({ path: "category", model: Category })
        .populate({ path: "players", model: Player, 
            populate: [{
                path: "user",
                select: "-password",
                model: User
            }]
        });
    return teams;
}

export function toTeamClient(team:TeamType):TeamTypeClient {
    return {
        _id: team._id.toString(),
        category: typeof team.category === "string"
            ? team.category
            : team.category._id.toString(),
        players: team.players.map(player =>
            typeof player === "string"
                ? { 
                    _id: player, 
                    user: { firstName: "", lastName: "" }, 
                    ranking: 0 
                }
                : {
                    _id: player._id.toString(),
                    user: {
                        firstName: player.user.firstName,
                        lastName: player.user.lastName
                    },
                    ranking: player.ranking
                }
        ),
        ranking: team.ranking,
    };
}
