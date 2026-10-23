import type { Task, TaskInput } from "@/types/task";

/**
 * Store de tâches synchronisé avec le localStorage.
 *
 * Conçu pour `useSyncExternalStore` : le serveur n'a pas accès au localStorage,
 * il expose donc un instantané `null` (état de chargement). Le client lit le
 * stockage après l'hydratation, ce qui évite toute divergence de rendu.
 */

const STORAGE_KEY = "taskflow:tasks";

export interface TaskStoreState {
  tasks: Task[];
  error: string | null;
}

const listeners = new Set<() => void>();
let state: TaskStoreState | null = null;

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    (task.status === "pending" || task.status === "completed") &&
    typeof task.createdAt === "string" &&
    typeof task.updatedAt === "string"
  );
}

function readFromStorage(): TaskStoreState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { tasks: [], error: null };

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Format de données invalide");

    return { tasks: parsed.filter(isTask), error: null };
  } catch {
    return {
      tasks: [],
      error: "Impossible de lire vos tâches enregistrées. Les données sont peut-être corrompues ou le stockage est indisponible.",
    };
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function handleStorageEvent(event: StorageEvent) {
  // Synchronise les onglets ouverts sur la même application.
  if (event.key === STORAGE_KEY || event.key === null) {
    state = readFromStorage();
    emit();
  }
}

export function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", handleStorageEvent);
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorageEvent);
  };
}

export function getSnapshot(): TaskStoreState {
  if (state === null) state = readFromStorage();
  return state;
}

export function getServerSnapshot(): TaskStoreState | null {
  return null;
}

/** Écrit les tâches. Lève une erreur si le stockage échoue (quota, mode privé…). */
function commit(tasks: Task[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    throw new Error("L'enregistrement a échoué : le stockage local est plein ou indisponible.");
  }
  state = { tasks, error: null };
  emit();
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function currentTasks(): Task[] {
  return getSnapshot().tasks;
}

export function addTask(input: TaskInput): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: generateId(),
    title: input.title.trim(),
    description: input.description.trim(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  commit([task, ...currentTasks()]);
  return task;
}

export function updateTask(id: string, input: TaskInput) {
  const now = new Date().toISOString();
  commit(
    currentTasks().map((task) =>
      task.id === id
        ? { ...task, title: input.title.trim(), description: input.description.trim(), updatedAt: now }
        : task,
    ),
  );
}

export function toggleTask(id: string): Task | undefined {
  const now = new Date().toISOString();
  let toggled: Task | undefined;
  commit(
    currentTasks().map((task) => {
      if (task.id !== id) return task;
      toggled = { ...task, status: task.status === "completed" ? "pending" : "completed", updatedAt: now };
      return toggled;
    }),
  );
  return toggled;
}

export function deleteTask(id: string) {
  commit(currentTasks().filter((task) => task.id !== id));
}

/** Réinsère une tâche supprimée à sa position chronologique (annulation). */
export function restoreTask(task: Task) {
  const tasks = currentTasks().filter((t) => t.id !== task.id);
  const index = tasks.findIndex((t) => t.createdAt < task.createdAt);
  tasks.splice(index === -1 ? tasks.length : index, 0, task);
  commit(tasks);
}

export function resetTasks() {
  commit([]);
}
