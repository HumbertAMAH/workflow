import type { Task } from "@/types/task";
import { TaskItem } from "./task-item";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export function TaskListSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
          <div className="size-6 animate-pulse rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
