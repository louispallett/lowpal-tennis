"use client";

import {
  SingleEliminationBracket,
  Match,
  SVGViewer,
  createTheme,
} from "@elyasasmad/react-tournament-brackets";
import { useWindowSize } from "@react-hook/window-size";
import { useEffect, useState } from "react";
import { ReactSVGPanZoom, TOOL_PAN, INITIAL_VALUE } from "react-svg-pan-zoom";

export default function Bracket({ matchData, categoryName }) {
  const [width, height] = useWindowSize();
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(INITIAL_VALUE);
  const [tool, setTool] = useState(TOOL_PAN);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isMobile = width <= 450;
  const isLarge = width > 1500;
  const finalWidth = isMobile
    ? width - 40
    : isLarge
      ? width - 400
      : Math.max(width - 200, 400);

  const matchCount = matchData.length;

  const finalHeight = Math.max(
    Math.min(matchCount * 90 + 120, height - 100),
    300,
  );

  return (
    <div className="flex flex-col justify-center my-2.5 flex-1">
      <h4 className="mt-5">{categoryName}</h4>
      <SingleEliminationBracket
        matches={matchData}
        options={{
          style: {
            roundHeader: { backgroundColor: "#fff" },
            connectorColor: "#4f46e5",
            connectorColorHighlight: "#000",
          },
        }}
        svgWrapper={({ children, ...props }) => (
          <ReactSVGPanZoom
            background="#e0e7ff00"
            detectAutoPan={false}
            SVGBackground="#e0e7ff00"
            width={finalWidth}
            height={finalHeight}
            value={value}
            tool={tool}
            toolbarProps={{ position: "none" }}
            miniatureProps={{ position: "none" }}
            onChangeValue={(nextValue) => {
              setValue(clampPan(nextValue));
            }}
            onChangeTool={setTool}
            style={{
              outline: "3px solid black",
              borderRadius: "10px",
            }}
            {...props}
          >
            {children}
          </ReactSVGPanZoom>
        )}
        matchComponent={({
          match,
          topParty,
          bottomParty,
          teamNameFallback,
          resultFallback,
        }) => (
          <>
            <span className="text-sm absolute font-black top-0 left-0 text-slate-700">
              {match.deadline}
            </span>
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
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "2.5px",
                }}
              >
                <div className="text-sm">
                  {topParty.name || teamNameFallback}
                </div>
                <div>{topParty.resultText ?? resultFallback(topParty)}</div>
              </div>
              <div
                style={{ height: "4px", width: "100%", background: "#4f46e5" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1.5px",
                }}
              >
                <div className="text-sm">
                  {bottomParty.name || teamNameFallback}
                </div>
                <div>{bottomParty.resultText ?? resultFallback(topParty)}</div>
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
}

function clampPan(value) {
  const { viewerWidth, viewerHeight, SVGWidth, SVGHeight, a, d } = value;

  const visibleWidth = viewerWidth / a;
  const visibleHeight = viewerHeight / d;

  const minX = Math.min(0, viewerWidth - SVGWidth * a);
  const minY = Math.min(0, viewerHeight - SVGHeight * d);

  const maxX = 0;
  const maxY = 0;

  return {
    ...value,
    e: Math.max(minX, Math.min(value.e, maxX)),
    f: Math.max(minY, Math.min(value.f, maxY)),
  };
}
