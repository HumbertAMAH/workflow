"use client";

import { useCallback, useState } from "react";
import { useActiveFilter } from "@/hooks/use-active-filter";
import { filterTasks, useTasks } from "@/hooks/use-tasks";
import { addTask, deleteTask, resetTasks, restoreTask, toggleTask, updateTask } from "@/lib/task-store";
import type { Task, TaskFilter, TaskInput } from "@/types/task";
import { ConfirmDialog } from "./confirm-dialog";
import { EmptyState } from "./empty-state";
import { FILTER_CONFIG } from "./filter-config";
import { StatsCards, StatsCardsSkeleton } from "./stats-cards";
import { TaskFilters } from "./task-filters";
import { TaskForm } from "./task-form";
import { TaskList, TaskListSkeleton } from "./task-list";
import { Button } from "./ui/button";
import { AlertIcon, PlusIcon } from "./ui/icons";
import { Modal } from "./ui/modal";
import { useToast } from "./ui/toast-provider";

type FormState = { mode: "create" } | { mode: "edit"; task: Task } | null;

const FILTERED_EMPTY: Record<Exclude<TaskFilter, "all">, { title: string; description: string }> = {
  pending: { title: "Aucune tâche en cours", description: "Bravo, tout est terminé ! Profitez-en ou ajoutez une nouvelle tâche." },
  completed: { title: "Aucune tâche terminée", description: "Cochez une tâche lorsqu'elle est finie pour la retrouver ici." },
};

export function TaskDashboard() {
  const filter = useActiveFilter();
  const { tasks, stats, isLoading, error } = useTasks();
  const toast = useToast();
  const [form, setForm] = useState<FormState>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  /** Exécute une opération sur le stockage et affiche une notification en cas d'échec. */
  const run = useCallback(
    (operation: () => void): boolean => {
      try {
        operation();
        return true;
      } catch (err) {
        toast(err instanceof Error ? err.message : "Une erreur inattendue est survenue.", { variant: "error" });
        return false;
      }
    },
    [toast],
  );

  const openCreate = () => setForm({ mode: "create" });
  const closeForm = () => setForm(null);

  function handleSubmit(values: TaskInput) {
    if (form?.mode === "edit") {
      if (run(() => updateTask(form.task.id, values))) {
        toast("Tâche mise à jour.");
        closeForm();
      }
    } else if (run(() => addTask(values))) {
      toast("Tâche ajoutée.");
      closeForm();
    }
  }

  function handleToggle(task: Task) {
    if (run(() => toggleTask(task.id))) {
      toast(task.status === "completed" ? "Tâche marquée comme en cours." : "Tâche terminée, bien joué !", {
        variant: task.status === "completed" ? "info" : "success",
      });
    }
  }

  function handleDelete() {
    const task = taskToDelete;
    if (!task) return;
    setTaskToDelete(null);
    if (run(() => deleteTask(task.id))) {
      toast("Tâche supprimée.", {
        variant: "info",
        action: {
          label: "Annuler",
          onClick: () => {
            if (run(() => restoreTask(task))) toast("Tâche restaurée.");
          },
        },
      });
    }
  }

  function handleReset() {
    setConfirmReset(false);
    if (run(resetTasks)) toast("Les données ont été réinitialisées.", { variant: "info" });
  }

  const visibleTasks = filterTasks(tasks, filter);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500">Organisez votre journée et suivez votre progression.</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <PlusIcon className="size-4" />
          Nouvelle tâche
        </Button>
      </header>

      {error && (
        <div role="alert" className="mt-6 flex flex-col gap-3 rounded-xl bg-rose-50 p-4 ring-1 ring-rose-200 sm:flex-row sm:items-center">
          <AlertIcon className="size-5 shrink-0 text-rose-600" />
          <p className="flex-1 text-sm text-rose-800">{error}</p>
          <Button variant="secondary" size="sm" onClick={() => setConfirmReset(true)}>
            Réinitialiser les données
          </Button>
        </div>
      )}

      <div className="mt-8">{isLoading ? <StatsCardsSkeleton /> : <StatsCards stats={stats} />}</div>

      <section aria-labelledby="tasks-heading" className="mt-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="tasks-heading" className="text-lg font-semibold tracking-tight text-slate-900">
            Mes tâches
            <span className="sr-only"> — filtre : {FILTER_CONFIG[filter].label}</span>
          </h2>
          <TaskFilters active={filter} stats={stats} />
        </div>

        <div aria-busy={isLoading}>
          {isLoading ? (
            <>
              <span className="sr-only">Chargement des tâches…</span>
              <TaskListSkeleton />
            </>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="Aucune tâche pour le moment"
              description="Commencez par créer votre première tâche pour organiser votre travail."
              action={
                <Button onClick={openCreate}>
                  <PlusIcon className="size-4" />
                  Créer une tâche
                </Button>
              }
            />
          ) : visibleTasks.length === 0 && filter !== "all" ? (
            <EmptyState {...FILTERED_EMPTY[filter]} />
          ) : (
            <TaskList tasks={visibleTasks} onToggle={handleToggle} onEdit={(task) => setForm({ mode: "edit", task })} onDelete={setTaskToDelete} />
          )}
        </div>
      </section>

      <Modal
        open={form !== null}
        onClose={closeForm}
        title={form?.mode === "edit" ? "Modifier la tâche" : "Nouvelle tâche"}
        description={form?.mode === "edit" ? "Mettez à jour les informations de la tâche." : "Ajoutez une tâche à votre liste."}
      >
        {form && (
          <TaskForm
            key={form.mode === "edit" ? form.task.id : "create"}
            initialValues={form.mode === "edit" ? { title: form.task.title, description: form.task.description } : undefined}
            submitLabel={form.mode === "edit" ? "Enregistrer" : "Ajouter la tâche"}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Supprimer cette tâche ?"
        description={taskToDelete ? `« ${taskToDelete.title} » sera définitivement supprimée.` : ""}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Réinitialiser les données ?"
        description="Toutes les tâches enregistrées dans ce navigateur seront effacées."
        confirmLabel="Réinitialiser"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
