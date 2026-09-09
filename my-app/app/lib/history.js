"use client";

const KEY = "oneatlas_history";

export function getHistory() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function addToHistory(prompt) {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((p) => p !== prompt);
  history.unshift(prompt);
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, 5)));
}
