"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/task-store";
import type { Task, TaskFilter } from "@/types/task";

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  progress: number;
}

const EMPTY: Task[] = [];

export function useTasks() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tasks = snapshot?.tasks ?? EMPTY;

  const stats = useMemo<TaskStats>(() => {
    const completed = tasks.filter((task) => task.status === "completed").length;
    const total = tasks.length;
    return {
      total,
      completed,
      pending: total - completed,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [tasks]);

  return {
    tasks,
    stats,
    isLoading: snapshot === null,
    error: snapshot?.error ?? null,
  };
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "all") return tasks;
  return tasks.filter((task) => task.status === filter);
}
