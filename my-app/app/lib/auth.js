"use client";

const KEY = "oneatlas_user";

export function login(name) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify({ name, loggedInAt: Date.now() }));
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}
