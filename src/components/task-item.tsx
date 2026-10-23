"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import type { Task } from "@/types/task";
import { StatusBadge } from "./status-badge";
import { CheckIcon, PencilIcon, TrashIcon } from "./ui/icons";

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const titleId = useId();
  const isCompleted = task.status === "completed";

  return (
    <li
      aria-labelledby={titleId}
      className="group flex animate-slide-up items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition-shadow hover:shadow-md hover:ring-slate-300/70 sm:p-5"
    >
      <label className="relative mt-0.5 flex size-6 shrink-0 cursor-pointer items-center justify-center">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task)}
          className="peer size-full cursor-pointer appearance-none rounded-full border-2 border-slate-300 transition-colors checked:border-emerald-500 checked:bg-emerald-500 hover:border-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        />
        <CheckIcon className="pointer-events-none absolute size-3.5 scale-50 stroke-[3] text-white opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100" />
        <span className="sr-only">{isCompleted ? "Marquer comme en cours" : "Marquer comme terminée"} : {task.title}</span>
      </label>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3
            id={titleId}
            className={cn(
              "font-medium break-words transition-colors",
              isCompleted ? "text-slate-400 line-through decoration-slate-300" : "text-slate-900",
            )}
          >
            {task.title}
          </h3>
          <StatusBadge status={task.status} />
        </div>
        {task.description && (
          <p
            className={cn(
              "mt-1 line-clamp-3 text-sm leading-relaxed break-words whitespace-pre-line",
              isCompleted ? "text-slate-400" : "text-slate-600",
            )}
          >
            {task.description}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-400">
          Créée le <time dateTime={task.createdAt}>{dateFormatter.format(new Date(task.createdAt))}</time>
        </p>
      </div>

      <div className="-mt-1 -mr-1 flex shrink-0 gap-0.5 transition-opacity sm:opacity-60 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Modifier : ${task.title}`}
          title="Modifier"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <PencilIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={`Supprimer : ${task.title}`}
          title="Supprimer"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </li>
  );
}
