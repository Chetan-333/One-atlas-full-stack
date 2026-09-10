"use client";

import { supabase } from "./supabaseClient";

const GUEST_KEY = "oneatlas_guest";

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") localStorage.removeItem(GUEST_KEY);
}

export function loginAsGuest() {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_KEY, "true");
}

export function isGuest() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_KEY) === "true";
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    return { id: user.id, email: user.email, name: profile?.name || user.email?.split("@")[0], guest: false };
  }

  if (isGuest()) {
    return { id: "guest", email: null, name: "Guest", guest: true };
  }

  return null;
}
