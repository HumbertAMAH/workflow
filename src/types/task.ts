export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description: string;
}

export type TaskFilter = "all" | "pending" | "completed";

export const TASK_FILTERS: readonly TaskFilter[] = ["all", "pending", "completed"];

export function isTaskFilter(value: unknown): value is TaskFilter {
  return typeof value === "string" && (TASK_FILTERS as readonly string[]).includes(value);
}
