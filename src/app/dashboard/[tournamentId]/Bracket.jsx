"use client"

import { SingleEliminationBracket, Match, SVGViewer, createTheme } from "@g-loot/react-tournament-brackets";
import { useWindowSize } from "@react-hook/window-size";
import { useEffect, useState } from "react";

export default function Bracket({ matchData, categoryName }) {
    const [width, height] = useWindowSize();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isMobile = width <= 450;
    const finalWidth = isMobile ? width - 40 : Math.max(width - 200, 400);
    const finalHeight = Math.max(height - 100, 500);

    return (
        <div className="flex flex-col justify-center my-2.5 flex-1">
            <h4 className="mt-5">{categoryName}</h4>
            <SingleEliminationBracket
                matches={matchData}
                options={{
                    style: {
                        roundHeader: { backgroundColor: "#000" },
                        connectorColor: "#4f46e5",
                        connectorColorHighlight: "#000",
                    },
                }}
                svgWrapper={({ children, ...props }) => (
                    <SVGViewer
                        background="#00000000"
                        SVGBackground="#e0e7ffb6"
                        width={finalWidth}
                        height={finalHeight}
                        style={{
                            outline: "3px solid black",
                            borderRadius: "10px",
                        }}
                        {...props}
                    >
                        {children}
                    </SVGViewer>
                )}
                matchComponent={({
                    match,
                    onMatchClick,
                    onPartyClick,
                    onMouseEnter,
                    onMouseLeave,
                    topParty,
                    bottomParty,
                    topWon,
                    bottomWon,
                    topHovered,
                    bottomHovered,
                    topText,
                    bottomText,
                    connectorColor,
                    computedStyles,
                    teamNameFallback,
                    resultFallback,
                }) => (
                    <>
                        <span className="text-sm absolute font-black top-0 left-0 text-slate-700">{match.deadline}</span>
                        <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            color: "#000",
                            width: "100%",
                            height: "100%",
                            background: "#00000000",
                        }}
                        >
                            <div
                                onMouseEnter={() => onMouseEnter(topParty.id)}
                                style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    gap: "2.5px",
                                }}
                            >
                                <div className="text-sm">{topParty.name || teamNameFallback}</div>
                                <div>{topParty.resultText ?? resultFallback(topParty)}</div>
                            </div>
                            <div
                                style={{ height: "4px", width: "100%", background: "#4f46e5" }}
                            />
                            <div
                            onMouseEnter={() => onMouseEnter(bottomParty.id)}
                                style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    gap: "1.5px" 
                                }}
                            >
                            <div className="text-sm">{bottomParty.name || teamNameFallback}</div>
                            <div>{bottomParty.resultText ?? resultFallback(topParty)}</div>
                            </div>
                        </div>
                    </>
                )}
            />
        </div>
    );
}

