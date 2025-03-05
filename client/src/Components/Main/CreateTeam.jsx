import { useEffect, useState } from "react"
import Loader from "../Auxiliary/Loader"
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CreateTeam() {
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState(null);
    const [teams, setTeams] = useState(null);
    const { categoryId } = useParams();

    useEffect(() => {
        const getPlayers = () => {
            axios.get("/api/players/get-players", { 
                headers: { categoryId }
            }).then((response) => {
                setPlayers(response.data.players);
            }).catch((err) => {
                console.log(err);
            })
        }

        const getTeams = () => {
            axios.get("/api/teams/get-teams", {
                headers: { categoryId }
            }).then((response) => {
                setTeams(response.data.teams.length);
            }).catch((err) => {
                console.log(err);
            })
        }

        getPlayers();
        getTeams();
        setLoading(false);
    }, []);

    console.log(teams);

    return (
        <div className="flex flex-col gap-5 mx-1.5 md:mx-5">
            { loading && (
                <Loader />
            )}
            { players && (
                <div className="flex flex-col gap-2.5">
                    <div className="form-input bg-lime-400">
                        { teams > 0 ? (
                            <p>Teams have already been created for this match.</p>
                        ) : (
                            <Players players={players} />
                        )}
                    </div>
                    <CreateTeams players={players} />
                </div>
            )}
            
        </div>
    )
}

function Players({ players }) {
    return (
        <div className="tournament-grid-sm">
            { players.map((player) => (
                <div className="form-input bg-slate-100">
                    <p>{player.user.firstName} {player.user.lastName}</p>
                    <p>Gender: {player.male ? "male" : "female"}</p>
                    <p>Seeded: {player.seeded ? "true" : "false"}</p>
                    <p>Ranking: {player.ranking === 0 ? "Not assigned" : player.ranking}</p>
                </div>
            ))}
        </div>
    )
}

function CreateTeams() {
    return (
        <button className="submit">Create Teams</button>
    )
}