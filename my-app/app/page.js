"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "./lib/auth";
import { getHistory, addToHistory } from "./lib/history";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";

const API_URL = "https://oneatlas-trial.onrender.com";
const STAGES = ["AppIntent", "DataSchema", "AppSpec", "Validation"];
const EXAMPLES = [
  "Task tracker with Slack notifications",
  "CRM for a real estate agency",
  "Expense tracker with Stripe billing",
];

const FEATURES = [
  { t: "Multi-Stage Pipeline", d: "Prompt flows through AppIntent, DataSchema, and AppSpec — each stage validated before the next runs.", icon: "⚡" },
  { t: "Validation & Repair Engine", d: "Structural, field, and consistency repair fix broken output locally instead of restarting generation.", icon: "🛠️" },
  { t: "Provider Routing", d: "Config-driven routing across LLM providers, balancing cost, latency, and capability per stage.", icon: "🔀" },
  { t: "Integration Registry", d: "Built-in metadata for Slack, Gmail, Stripe, WhatsApp, Jira, and Google Sheets.", icon: "🔌" },
];

const HOW_IT_WORKS = [
  { t: "Describe", d: "Write your app idea in plain language" },
  { t: "Generate", d: "Pipeline extracts intent, schema & spec" },
  { t: "Validate", d: "Each stage is checked and auto-repaired" },
  { t: "Ship", d: "Get a structured, machine-readable AppSpec" },
];

function stageIndex(status) {
  if (!status) return -1;
  const s = status.toLowerCase();
  if (s.includes("intent")) return 0;
  if (s.includes("schema")) return 1;
  if (s.includes("appspec") || s.includes("spec")) return 2;
  if (["completed", "failed", "repair_attempted", "validated"].some((x) => s.includes(x))) return 3;
  return -1;
}

function Stepper({ status }) {
  const active = stageIndex(status);
  return (
    <div className="flex items-center w-full mb-8">
      {STAGES.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300
                ${i <= active
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-400 bg-white dark:bg-zinc-800"}`}
            >
              {i < active ? "✓" : i + 1}
            </div>
            <span className={`text-xs ${i <= active ? "text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-400"}`}>{label}</span>
          </div>
          {i < STAGES.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${i < active ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-zinc-200 dark:bg-zinc-700"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function CopyButton({ data }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={handleCopy}
      className="text-xs text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

function JsonCard({ title, data }) {
  const empty = !data || (typeof data === "object" && Object.keys(data).length === 0);
  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {title}
        </h3>
        {!empty && <CopyButton data={data} />}
      </div>
      {empty ? (
        <p className="text-xs text-zinc-400">No data</p>
      ) : (
        <pre className="text-xs text-zinc-600 dark:text-zinc-300 overflow-auto max-h-64 bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 bg-white/90 dark:bg-zinc-800/90">
      <div className="h-4 w-32 rounded animate-shimmer mb-3" />
      <div className="h-20 w-full rounded-xl animate-shimmer" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl mt-6">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-2xl mb-3">
        📋
      </div>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Your generated AppSpec will appear here</p>
      <p className="text-xs text-zinc-400 mt-1">Describe an app above and hit Generate</p>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [slowStart, setSlowStart] = useState(false);
  const [toasts, setToasts] = useState([]);
  const slowTimerRef = useRef(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setChecked(true);
        setHistory(getHistory());
      }
    });
  }, [router]);

  function pushToast(message, type = "success") {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }

  async function generate(overridePrompt) {
    const activePrompt = overridePrompt ?? prompt;
    if (!activePrompt.trim()) return;
    setLoading(true);
    setError(null);
    setJob(null);
    setStatus("starting");
    setSlowStart(false);

    slowTimerRef.current = setTimeout(() => setSlowStart(true), 6000);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: activePrompt }),
      });
      if (!res.ok) throw new Error("Failed to start generation job");
      const { jobId } = await res.json();

      let done = false;
      while (!done) {
        await new Promise((r) => setTimeout(r, 2000));
        const jr = await fetch(`${API_URL}/api/generate/${jobId}`);
        if (!jr.ok) throw new Error("Failed to fetch job status");
        const data = await jr.json();
        setStatus(data.status);
        setJob(data);
        if (["completed", "failed", "repair_attempted"].includes(data.status)) {
          done = true;
        }
      }
      addToHistory(activePrompt);
      setHistory(getHistory());
      pushToast("AppSpec generated successfully", "success");
    } catch (e) {
      setError(e.message || "Something went wrong");
      pushToast(e.message || "Generation failed", "error");
    } finally {
      clearTimeout(slowTimerRef.current);
      setSlowStart(false);
      setLoading(false);
    }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(job.result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appspec.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!checked) return null;

  const result = job?.result || {};

  return (
    <div className="min-h-full bg-gradient-to-b from-emerald-50/40 via-zinc-50 to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      <Navbar />
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-200/40 dark:bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 100% pass rate · 12/12 eval prompts
          </span>
          <h1 className="text-6xl md:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
            From idea to <span className="text-emerald-600 dark:text-emerald-400">validated AppSpec</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-6 text-lg max-w-2xl mx-auto">
            OneAtlas turns a plain-language app description into a structured, machine-readable
            specification — with validation and repair built into every stage.
          </p>
          <a
            href="#generator"
            className="inline-block mt-10 bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-emerald-600 dark:to-emerald-500 text-white text-base font-medium px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-zinc-900/20 active:scale-[0.97] transition-all"
          >
            Try it now ↓
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map((s, i) => (
            <div
              key={s.t}
              className="group bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 text-center shadow-sm cursor-default transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300"
            >
              <div className="w-9 h-9 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                {i + 1}
              </div>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{s.t}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">What powers it</h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400 mb-8">A pipeline built for reliability, not just output.</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="bg-white/90 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{f.t}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GENERATOR TOOL */}
      <section id="generator" className="max-w-4xl mx-auto px-6 py-20 scroll-mt-16">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-2">Try It</p>
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">AppSpec Generator</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-base">
              Describe an app in plain language. Get a validated, structured spec.
            </p>
          </div>
          {history.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 transition-colors"
              >
                Recent ⌄
              </button>
              {showHistory && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-10 overflow-hidden">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(h);
                        setShowHistory(false);
                      }}
                      className="block w-full text-left text-xs px-3 py-2.5 text-zinc-600 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border-b border-zinc-100 dark:border-zinc-700 last:border-0 truncate"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 rounded-2xl p-7 shadow-lg shadow-zinc-900/5">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Build a CRM for a real estate agency. Agents manage leads, properties, and deals..."
            rows={5}
            className="w-full resize-none text-base text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 bg-transparent focus:outline-none"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-zinc-400">
              {status ? `Status: ${status}` : "Idle"}
              {slowStart && loading && (
                <span className="block text-amber-500 mt-1">Waking up the server — first request can take 20-30s…</span>
              )}
            </span>
            <button
              onClick={() => generate()}
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-emerald-600 dark:to-emerald-500 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-zinc-900/20 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? "Generating…" : "Generate AppSpec"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center justify-between text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <span>{error}</span>
            <button
              onClick={() => generate(prompt)}
              className="text-xs font-medium text-red-600 hover:text-red-800 underline ml-4 flex-shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {(loading || job) && (
          <div className="mt-10">
            <Stepper status={status} />
          </div>
        )}

        {loading && !job && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {job && (
          <div>
            <div className="flex justify-end mb-3">
              <button
                onClick={downloadJson}
                className="text-xs font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                ⬇ Download AppSpec
              </button>
            </div>
            <div className="space-y-4">
              <JsonCard title="AppIntent" data={result.intent} />
              <JsonCard title="DataSchema" data={result.data_schema} />
              <JsonCard title="AppSpec" data={result.appspec} />
              {result.repair_logs?.length > 0 && <JsonCard title="Repair Logs" data={result.repair_logs} />}
            </div>
          </div>
        )}

        {!loading && !job && <EmptyState />}
      </section>

      <footer className="pb-10 text-xs text-zinc-400 text-center">github.com/Chetan-333/OneAtlas-Trial</footer>
    </div>
  );
}
