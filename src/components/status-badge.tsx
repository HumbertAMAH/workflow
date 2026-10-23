import { cn } from "@/lib/cn";
import type { TaskStatus } from "@/types/task";

const styles: Record<TaskStatus, { label: string; className: string; dot: string }> = {
  pending: { label: "En cours", className: "bg-amber-50 text-amber-700 ring-amber-600/15", dot: "bg-amber-500" },
  completed: { label: "Terminée", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", dot: "bg-emerald-500" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className, dot } = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden="true" />
      {label}
    </span>
  );
}
