"use client"

import Bracket from "@/app/dashboard/[tournamentId]/Bracket";
import { MatchType } from "@/lib/types";
import { ChevronDoubleLeftIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

type AboutClientProps = { matches: MatchType[] }

export default function AboutClient({ matches }:AboutClientProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="standard-container bg-slate-200/75 my-2.5">
            <div className="flex gap-5 items-center button-default"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="home-subtitle text-4xl!">How it works</h3>
                <div className={isOpen ? "wrapper one-eighty" : "wrapper"}>
                    <ChevronDoubleLeftIcon className={ isOpen ? "arrow" : "arrow bounce"} />
                </div>
            </div>
            <div className={ isOpen ? "mt-5" : "hidden" }>
                <div className="flex flex-col gap-2.5">
                    <p>
                        One of the key parts of this project is the seeding algorithm. This allows a host to enter the names and rankings of players
                        and return a tournament bracket, whereby the highest ranking players are placed in the tournament so that they do not meet
                        each other until later.
                    </p>
                    <p>
                        So, in the case where a tournament has eight players:
                    </p>
                    <ul>
                        <li>Players 1 & 2 cannot meet each other until the final.</li>
                        <li>Players 1 - 4 cannot meet each other until the semi-finals.</li>
                        <li>Players 1 - 8 cannot meet each other until the quarter-finals.</li>
                        <li>... and so on.</li>
                    </ul>
                    <p>
                        If we 'name' the players after their ranking, we get a tournament like this:
                    </p>
                    <div className="flex justify-center items-center flex-1">
                        <Bracket matchData={matches} categoryName="" />
                    </div>
                    <p>
                        Tournament brackets are made from powers of 2 (2, 4, 8, 16, 32, 64, etc.), because they can be halved into integers until they
                        reach 1 (i.e., our final). So, if the number of players is <i>not</i> a power of 2, there will be qualifying matches. The lowest
                        ranked players are placed in these qualifying matches.
                    </p>
                    <p>
                        Qualifying matches are just that - they are matches for players to <i>qualify</i> into the tournament, so they are not displayed
                        on the bracket.
                    </p>
                </div>
            </div>
        </div>
    )

}
