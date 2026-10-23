"use client";

import Link from "next/link";
import { Suspense } from "react";
import { filterHref, useActiveFilter } from "@/hooks/use-active-filter";
import { useTasks } from "@/hooks/use-tasks";
import { cn } from "@/lib/cn";
import { TASK_FILTERS, type TaskFilter } from "@/types/task";
import { FILTER_CONFIG } from "./filter-config";
import { Logo } from "./logo";

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white px-4 py-6 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <Suspense fallback={<div className="mt-10 h-40" aria-hidden="true" />}>
        <SidebarNav />
      </Suspense>
      <SidebarFooter />
    </aside>
  );
}

function SidebarNav() {
  const active = useActiveFilter();
  const { stats, isLoading } = useTasks();
  const counts: Record<TaskFilter, number> = { all: stats.total, pending: stats.pending, completed: stats.completed };

  return (
    <nav aria-label="Navigation principale" className="mt-10">
      <p className="mb-2 px-3 text-xs font-medium tracking-wider text-slate-400 uppercase">Menu</p>
      <ul className="space-y-1">
        {TASK_FILTERS.map((filter) => {
          const { navLabel, icon: Icon } = FILTER_CONFIG[filter];
          const isActive = filter === active;
          return (
            <li key={filter}>
              <Link
                href={filterHref(filter)}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-indigo-500",
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className={cn("size-5", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                <span className="flex-1">{navLabel}</span>
                {!isLoading && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs tabular-nums",
                      isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {counts[filter]
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="mt-auto rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4 ring-1 ring-indigo-100">
      <p className="text-sm font-medium text-slate-800">Vos données restent ici</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Les tâches sont enregistrées dans votre navigateur, sans compte ni serveur.
      </p>
    </div>
  );
}
