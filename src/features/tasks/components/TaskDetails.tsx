"use client";

import { isValid, parseISO } from "date-fns";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ConfirmDialog } from "@/src/components/ConfirmDialog";
import { DeleteIcon } from "@/src/components/Icons";
import { UpcomingTask } from "../interfaces/upcoming-task.interface";
import { useUpcomingTasksStore } from "../stores/upcoming-tasks.store";

type TaskDetailsProps = {
  task: UpcomingTask | null;
  onTaskDeleted?: () => void;
};

// Genera el texto de fecha del detalle con el formato:
// "<día de la semana> <día> de <mes> · <hora>".
const formatTaskDetailDate = (dueDate: string) => {
  const parsedDate = parseISO(dueDate);
  if (!isValid(parsedDate)) {
    return "Fecha inválida";
  }
  const readableDate = format(parsedDate, "EEEE d 'de' MMMM", { locale: es });
  const capitalizedDate = readableDate.charAt(0).toUpperCase() + readableDate.slice(1);
  const hour = format(parsedDate, "HH:mm");
  return `${capitalizedDate} · ${hour}`;
};

export const TaskDetails = ({ task, onTaskDeleted }: TaskDetailsProps) => {
  // El componente se renderiza de forma condicional con la tarea seleccionada en el calendario.
  // También concentra la acción destructiva de eliminar tarea contra la store.
  const deleteTask = useUpcomingTasksStore((state) => state.deleteTask);

  // Si no hay tarea seleccionada, no se muestra panel de detalle.
  if (!task) return null;

  // Se muestra una fecha descriptiva y legible con día, fecha y hora.
  const dueDateLabel = formatTaskDetailDate(task.dueDate);

  // Al confirmar eliminación se limpia la tarea y se notifica al contenedor para cerrar el detalle.
  const handleDeleteTask = () => {
    deleteTask(task.id);
    onTaskDeleted?.();
  };

  return (
    <section className="task-details-enter bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Detalle de la tarea</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{dueDateLabel}</p>
        </div>
        <ConfirmDialog
          title="Eliminar tarea"
          description="Esta acción no se puede deshacer. ¿Deseas eliminar la tarea?"
          onConfirm={handleDeleteTask}
          confirmText="Eliminar"
          confirmColor="red"
          trigger={
            <button
              type="button"
              aria-label="Eliminar tarea"
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/15 transition-colors cursor-pointer text-xs font-semibold"
            >
              <DeleteIcon className="w-3.5 h-3.5" />
              Eliminar
            </button>
          }
        />
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-white/5 p-4 space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Título</p>
          <p className="text-sm font-semibold text-slate-800 dark:text-white mt-1">{task.title}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Descripción corta
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{task.shortDescription}</p>
        </div>
        {task.comments ? (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Comentarios</p>
            <p className="text-sm text-slate-700 dark:text-slate-200 mt-1 whitespace-pre-wrap">{task.comments}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
};
