"use client"

import { useState } from "react";

const tournamentStages:string[] = ["sign-up", "draw", "play", "finished"];

export default function NextStage({ stage }: { stage:string }) {
    const [isPending, setIsPending] = useState(false);
    const index:number = tournamentStages.indexOf(stage);
    return (
        <button className="submit">
            { stage === "play" ? (
                <>Finish Tournament</>
            ) : (
                <>Move to Next Stage: {tournamentStages[index + 1]}</>
            )}
        </button>
    )
}