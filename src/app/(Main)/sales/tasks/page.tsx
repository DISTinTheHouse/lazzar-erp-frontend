import { TaskCalendarPanel } from "@/src/features/tasks/components/TaskCalendarPanel";

export default function SalesTasksPage() {
  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
          Seguimiento de tareas comerciales, agenda de vencimientos y prioridades del equipo.
        </p>
      </div>
      <TaskCalendarPanel />
    </div>
  );
}

