"use client";

import { useSearchParams } from "next/navigation";
import { isTaskFilter, type TaskFilter } from "@/types/task";

/** Filtre courant, lu depuis l'URL (`?filter=pending`) pour être partageable et compatible avec l'historique. */
export function useActiveFilter(): TaskFilter {
  const value = useSearchParams().get("filter");
  return isTaskFilter(value) ? value : "all";
}

export function filterHref(filter: TaskFilter): string {
  return filter === "all" ? "/" : `/?filter=${filter}`;
}
