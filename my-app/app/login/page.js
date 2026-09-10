"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, loginAsGuest } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password");
      return;
    }
    setLoading(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password, name.trim() || email.split("@")[0]);
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setInfo("Account created. Check your email to confirm, then sign in.");
      setMode("signin");
      return;
    }

    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
  }

  function handleSkip() {
    loginAsGuest();
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-zinc-100 relative overflow-hidden px-4">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-zinc-300 rounded-full blur-3xl opacity-30" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-zinc-900/10 rounded-3xl p-8 w-full max-w-sm"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold mb-4 shadow-lg shadow-emerald-500/30">
          OA
        </div>
        <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-1">OneAtlas</p>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h1>
        <div className="flex gap-4 mb-6 mt-3">
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(""); setInfo(""); }}
            className={`text-xs font-medium pb-1 border-b-2 transition-colors ${mode === "signin" ? "border-emerald-500 text-emerald-700" : "border-transparent text-zinc-400"}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
            className={`text-xs font-medium pb-1 border-b-2 transition-colors ${mode === "signup" ? "border-emerald-500 text-emerald-700" : "border-transparent text-zinc-400"}`}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs text-zinc-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chetan Mittal"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-zinc-500">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        {info && <p className="text-xs text-emerald-600 mt-3">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-zinc-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-zinc-700 active:scale-[0.98] transition-all shadow-lg shadow-zinc-900/20 disabled:opacity-50"
        >
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full mt-3 text-zinc-500 text-sm font-medium py-2.5 rounded-xl hover:bg-zinc-100 hover:text-zinc-700 transition-all"
        >
          Skip for now →
        </button>
      </form>
    </div>
  );
}
