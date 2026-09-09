"use client";

const KEY = "oneatlas_theme";

export function getTheme() {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(KEY) || "light";
}

export function applyTheme(theme) {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(KEY, theme);
}
