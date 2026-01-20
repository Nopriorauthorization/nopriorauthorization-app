// Base section container for Blueprint sections
import React, { useState } from "react";

interface BlueprintSectionProps {
  title: string;
  summary: React.ReactNode;
  children: React.ReactNode;
  complete?: boolean;
  lastUpdated?: string;
  dataSource?: string;
  empty?: boolean;
}

export default function BlueprintSection({
  title,
  summary,
  children,
  complete = false,
  lastUpdated = "",
  dataSource = "user",
  empty = false,
}: BlueprintSectionProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 shadow-lg transition-all`}
      data-state={expanded ? "expanded" : "collapsed"}
      data-complete={complete ? "true" : "false"}
    >
      <header
        className="flex items-center justify-between cursor-pointer px-6 py-4 select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-1">{title}</h2>
          <div className="text-gray-400 text-sm">{expanded ? null : summary}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-1 rounded-full ${complete ? "bg-green-700 text-green-300" : "bg-gray-700 text-gray-400"}`}>{complete ? "Complete" : "Incomplete"}</span>
          <span className="text-xs text-pink-300">Last updated: {lastUpdated}</span>
          <span className="text-xs text-pink-300">Source: {dataSource}</span>
          <button
            className="ml-2 text-lg text-pink-400 focus:outline-none"
            aria-label={expanded ? "Collapse section" : "Expand section"}
          >
            {expanded ? "−" : "+"}
          </button>
        </div>
      </header>
      <div className={`overflow-hidden transition-all ${expanded ? "max-h-[1000px] py-4 px-6" : "max-h-0 px-6 py-0"}`}
        aria-hidden={!expanded}
      >
        {expanded && (empty ? <div className="text-pink-300 italic py-4">No data yet. {summary}</div> : children)}
      </div>
    </section>
  );
}
