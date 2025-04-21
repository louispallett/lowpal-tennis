import { SingleEliminationBracket, Match, SVGViewer, createTheme } from '@g-loot/react-tournament-brackets';
import { useWindowSize } from '@react-hook/window-size'

export default function Bracket({ matchData, categoryName }) {
    const [width, height] = useWindowSize();
    const finalWidth = Math.max(width - 50, 400);
    const finalHeight = Math.max(height - 50, 500);

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
        scoreWidth: 40,
        connectorColorHighlight: '#da96c6',
        svgBackground: '#FAFAFA',
    });

    return (
        <div className="flex flex-col justify-center my-2.5 flex-1">
            { matchData && (
                <>
                    <h4>{categoryName}</h4>
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
                </>
            )}
        </div>
    )
}