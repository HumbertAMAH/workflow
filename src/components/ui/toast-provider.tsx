"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AlertIcon, CheckCircleIcon, InfoIcon, XIcon } from "./icons";

type ToastVariant = "success" | "error" | "info";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
}

interface ToastOptions {
  variant?: ToastVariant;
  action?: ToastAction;
}

type ShowToast = (message: string, options?: ToastOptions) => void;

const ToastContext = createContext<ShowToast | null>(null);

const TOAST_DURATION = 4500;
const MAX_TOASTS = 3;

const variantStyles: Record<ToastVariant, { icon: typeof InfoIcon; className: string }> = {
  success: { icon: CheckCircleIcon, className: "text-emerald-400" },
  error: { icon: AlertIcon, className: "text-rose-400" },
  info: { icon: InfoIcon, className: "text-indigo-300" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback<ShowToast>((message, options = {}) => {
    const toast: Toast = { id: nextId.current++, message, variant: options.variant ?? "success", action: options.action };
    setToasts((current) => [...current, toast].slice(-MAX_TOASTS));
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const { icon: Icon, className } = variantStyles[toast.variant];

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-center gap-3 rounded-xl bg-slate-900 py-3 pr-2 pl-4 text-sm text-white shadow-lg shadow-slate-900/20"
    >
      <Icon className={cn("size-5 shrink-0", className)} />
      <p className="flex-1">{toast.message}</p>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick();
            onDismiss(toast.id);
          }}
          className="rounded-md px-2 py-1 font-semibold text-indigo-300 transition-colors hover:bg-white/10 hover:text-indigo-200 focus-visible:outline-2 focus-visible:outline-indigo-400"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fermer la notification"
        className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-400"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}

export function useToast(): ShowToast {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast doit être utilisé dans un <ToastProvider>.");
  return context;
}
