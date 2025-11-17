"use client";

import { MatchType } from "@/lib/types";
import { useState } from "react";
import SubmitResultsForm from "../../SubmitResultsForm";

type StagePlayProps = {
  matches: MatchType[];
};

export default function StagePlay({ matches }: StagePlayProps) {
  return (
    <>
      {matches.length > 0 ? (
        <>
          <p>Click on a match below to enter a result.</p>
          {matches.map((match) => (
            <MatchCard match={match} key={match._id} />
          ))}
        </>
      ) : (
        <p>No matches to play!</p>
      )}
    </>
  );
}

type MatchCardProps = {
  match: MatchType;
};

function MatchCard({ match }: MatchCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className={isOpen ? "standard-container" : "submit"}>
        <p
          onClick={() => setIsOpen(!isOpen)}
          className={isOpen ? "mb-2.5" : ""}
        >
          {match.participants[0].name} vs. {match.participants[1].name}
        </p>
        <div className={isOpen ? "" : "hidden"}>
          <SubmitResultsForm info={match} />
          <button className="danger mt-2.5" onClick={() => setIsOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
