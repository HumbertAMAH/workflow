import type { ComponentType, SVGProps } from "react";
import type { TaskStats } from "@/hooks/use-tasks";
import { cn } from "@/lib/cn";
import { CheckCircleIcon, ClockIcon, ListIcon } from "./ui/icons";

interface StatCardProps {
  label: string;
  value: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: string;
}

function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-11", tone)}>
        <Icon className="size-5" />
      </span>
      <div>
        <dt className="text-xs text-slate-500 sm:text-sm">{label}</dt>
        <dd className="text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
      </div>
    </div>
  );
}

export function StatsCards({ stats }: { stats: TaskStats }) {
  return (
    <section aria-label="Statistiques" className="grid grid-cols-3 gap-3 sm:gap-4 xl:grid-cols-4">
      <dl className="contents">
        <StatCard label="Total des tâches" value={stats.total} icon={ListIcon} tone="bg-slate-100 text-slate-600" />
        <StatCard label="Restantes" value={stats.pending} icon={ClockIcon} tone="bg-amber-50 text-amber-600" />
        <StatCard label="Terminées" value={stats.completed} icon={CheckCircleIcon} tone="bg-emerald-50 text-emerald-600" />
      </dl>
      <div className="col-span-3 flex flex-col justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white xl:col-span-1 shadow-sm shadow-indigo-600/20">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-indigo-100">Progression</p>
          <p className="text-2xl font-semibold tabular-nums">{stats.progress}%</p>
        </div>
        <div
          role="progressbar"
          aria-label="Progression des tâches"
          aria-valuenow={stats.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"
        >
          <div
            className="h-full rounded-full bg-white transition-[width] duration-500 ease-out"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div aria-hidden="true" className="grid grid-cols-3 gap-3 sm:gap-4 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-[86px] animate-pulse last:col-span-3 xl:last:col-span-1 rounded-2xl bg-white ring-1 ring-slate-200/70" />
      ))}
    </div>
  );
}
