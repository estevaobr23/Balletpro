"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Tone = "success" | "error" | "info";
type Toast = { id: number; message: string; tone: Tone };
const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, tone: Tone = "success") => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3500);
  }, []);
  const value = useMemo(() => show, [show]);
  return <ToastContext.Provider value={value}>{children}<div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col items-end gap-2" aria-live="polite">{toasts.map((toast) => <div key={toast.id} className={`animate-toast-in pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-lg ${toast.tone === "error" ? "border-red-200 text-danger" : toast.tone === "info" ? "border-amber-200 text-warning" : "border-green-200 text-success"}`}><span className="h-2 w-2 rounded-full bg-current"/>{toast.message}</div>)}</div></ToastContext.Provider>;
}

export function useToast() { return useContext(ToastContext); }
