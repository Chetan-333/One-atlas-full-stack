"use client";

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={`cursor-pointer max-w-xs px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-fade-in-up ${
            t.type === "error" ? "bg-red-500" : "bg-emerald-600"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
