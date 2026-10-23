import Link from "next/link";
import { filterHref } from "@/hooks/use-active-filter";
import type { TaskStats } from "@/hooks/use-tasks";
import { cn } from "@/lib/cn";
import { TASK_FILTERS, type TaskFilter } from "@/types/task";
import { FILTER_CONFIG } from "./filter-config";

interface TaskFiltersProps {
  active: TaskFilter;
  stats: TaskStats;
}

export function TaskFilters({ active, stats }: TaskFiltersProps) {
  const counts: Record<TaskFilter, number> = { all: stats.total, pending: stats.pending, completed: stats.completed };

  return (
    <nav aria-label="Filtrer les tâches">
      <ul className="inline-flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
        {TASK_FILTERS.map((filter) => {
          const isActive = filter === active;
          return (
            <li key={filter} className="flex-1 sm:flex-none">
              <Link
                href={filterHref(filter)}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
                  "focus-visible:outline-2 focus-visible:outline-indigo-500",
                  isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
                )}
              >
                {FILTER_CONFIG[filter].label}
                <span className={cn("text-xs tabular-nums", isActive ? "text-indigo-600" : "text-slate-400")}>
                  {counts[filter]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
