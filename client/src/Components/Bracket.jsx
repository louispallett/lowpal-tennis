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
                const response = await fetch(`/api/brackets/${categoryId}`, { mode: "cors" });
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
        // svgBackground: '#FAFAFA',
    });

    return (
        <div className="flex flex-col justify-center my-2.5 flex-1">
            { loading && (
                <div className="flex justify-center m-10 items-center p-20 bg-slate-300 rounded-lg shadow dark:bg-slate-700">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-indigo-500 animate-spin dark:text-gray-600 fill-lime-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
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
                    <Link to="/dashboard/brackets" className="flex w-full my-10 gap-1.5 items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <ArrowUturnLeftIcon className="h-4" />
                        <p>Back to bracket list</p>
                    </Link>
                </>
            )}
        </div>
    )
}
