"use client";

import { useState } from "react";
import { renderComponent } from "./componentRegistry";
import { findEntity } from "./fieldHelpers";

export default function UIPreview({ appspec, dataSchema }) {
  const pages = appspec?.pages || [];
  const [active, setActive] = useState(0);

  if (pages.length === 0) return null;

  const page = pages[Math.min(active, pages.length - 1)];
  const entity = findEntity(dataSchema, page.boundEntity);

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white/90 dark:bg-zinc-800/90 shadow-sm">
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-700 px-3 py-2 overflow-x-auto">
        {pages.map((p, i) => (
          <button
            key={`${p.route}-${i}`}
            onClick={() => setActive(i)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              i === active
                ? "bg-emerald-600 text-white"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{page.name}</h4>
            <p className="text-[11px] text-zinc-400 font-mono">{page.route}</p>
          </div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wide">{page.layout}</span>
        </div>

        {page.components.map((c) => renderComponent(c, entity))}
      </div>
    </div>
  );
}
