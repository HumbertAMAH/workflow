import { Suspense } from "react";
import { TaskDashboard } from "@/components/task-dashboard";
import { TaskListSkeleton } from "@/components/task-list";

export default function HomePage() {
  return (
    // Le tableau de bord lit le filtre dans l'URL (useSearchParams), d'où la frontière Suspense.
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
          <TaskListSkeleton />
        </div>
      }
    >
      <TaskDashboard />
    </Suspense>
  );
}
