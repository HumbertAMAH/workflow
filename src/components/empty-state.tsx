import type { ReactNode } from "react";
import { InboxIcon } from "./ui/icons";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex animate-fade-in flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
        <InboxIcon className="size-7" />
      </span>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
