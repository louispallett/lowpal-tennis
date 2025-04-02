import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

export default function CloseRegistration() {
    const {tournamentId} = useParams();
    const [data, setData] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem("Authorization");
        const getTournamentInfo = () => {
            axios.get("/api/tournaments/get-tournament-info", {
                headers: {
                    Authorization: token,
                    TournamentId: tournamentId
                }
            }).then((response) => {
                setData(response.data.categories);
            }).catch((err) => {
                console.log(err);
            });
        }
        getTournamentInfo();
    }, [])
    console.log(data);
    return (
        <></>
    )
}