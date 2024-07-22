import { SingleEliminationBracket, Match, SVGViewer, createTheme } from '@g-loot/react-tournament-brackets';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useWindowSize } from '@react-hook/window-size'
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";

export default function Bracket() {
    const { categoryId } = useParams();
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [width, height] = useWindowSize();
    const finalWidth = Math.max(width - 50, 400);
    const finalHeight = Math.max(height - 50, 500);

    useEffect(() => {
        const getMatch = async () => {
            try {
                const response = await fetch(`https://lowpal-tennis-server.fly.dev/api/brackets/${categoryId}`, { mode: "cors" });
                if (!response.ok) throw new Error(response.status);
                const actualData = await response.json();
                setMatchData(actualData.matches);
                setError(null);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getMatch();
    }, [])

    const WhiteTheme = createTheme({
        textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
        matchBackground: { wonColor: '#daebf9', lostColor: '#96c6da' },
        score: {
          background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
          text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
        },
        border: {
          color: '#CED1F2',
          highlightedColor: '#da96c6',
        },
        roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
        connectorColor: '#CED1F2',
        connectorColorHighlight: '#da96c6',
        svgBackground: '#FAFAFA',
    });

    return (
        <div className="flex flex-col justify-center my-2.5 flex-1">
            { loading && (
                <div className="flex justify-center items-center p-20">
                    <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                        <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                            <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner">
                                    <div className="p-1 border-t border-indigo-400 rounded-full" id="spinner"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            { matchData && (
                <>
                    <SingleEliminationBracket
                        theme={WhiteTheme}
                        matches={matchData}
                        matchComponent={Match}
                        svgWrapper={({ children, ...props }) => (
                        <SVGViewer width={finalWidth} height={finalHeight} {...props}>
                            {children}
                        </SVGViewer>
                    )}
                    />
                    <Link to="/dashboard/brackets" className="flex w-full my-10 gap-1.5 items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                        <ArrowUturnLeftIcon className="h-4" />
                        <p>Back to bracket list</p>
                    </Link>
                </>
            )}
        </div>
    )
}
