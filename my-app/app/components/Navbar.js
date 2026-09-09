"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "../lib/auth";
import { getTheme, applyTheme } from "../lib/theme";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setUser(getUser());
    const t = getTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/30">
            OA
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">OneAtlas</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </a>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-zinc-200 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300 hidden sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
