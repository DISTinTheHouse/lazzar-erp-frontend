"use client";

import type { EventInput } from "@fullcalendar/core";
import { addMinutes, isValid, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { useUpcomingTasksStore } from "../stores/upcoming-tasks.store";

const toneClasses = ["event-sky"];

export const useTasksCalendarEvents = () => {
  // Fuente única de verdad para tareas e hidratación.
  const tasks = useUpcomingTasksStore((state) => state.tasks);
  const hasHydrated = useUpcomingTasksStore((state) => state.hasHydrated);
  const updateTask = useUpcomingTasksStore((state) => state.updateTask);
  // Estado UI para detalle seleccionado y control del diálogo de alta.
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [dialogCalendarDate, setDialogCalendarDate] = useState<Date | null>(null);

  // Mapa para resolver rápidamente una tarea cuando se arrastra/redimensiona un evento.
  const taskById = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  // Adaptación de tareas de store al formato EventInput que espera FullCalendar.
  const calendarEvents = useMemo<EventInput[]>(
    () =>
      tasks.flatMap((task, index) => {
        const start = parseISO(task.dueDate);
        if (!isValid(start)) return [];
        return [
          {
            id: task.id,
            title: task.title,
            start,
            end: addMinutes(start, 45),
            classNames: [toneClasses[index % toneClasses.length]],
          },
        ];
      }),
    [tasks]
  );

  const handleEventDateChange = (eventId: string, start: Date | null) => {
    if (!start) return;
    const task = taskById.get(eventId);
    if (!task) return;
    // Persistimos en store la nueva fecha del evento movido o redimensionado.
    updateTask({
      ...task,
      dueDate: start.toISOString(),
    });
  };

  const handleEventClick = (eventId: string) => {
    setSelectedTaskId(eventId);
  };

  const handleDateClick = (date: Date, clickDetail: number) => {
    // Solo en doble click se abre el modal para crear una nueva tarea.
    if (clickDetail !== 2) return;
    setDialogCalendarDate(date);
    setIsTaskDialogOpen(true);
  };

  const handleTaskDialogOpenChange = (open: boolean) => {
    setIsTaskDialogOpen(open);
    if (!open) {
      setDialogCalendarDate(null);
    }
  };

  // Se expone la tarea seleccionada para que el panel de detalle renderice su contenido.
  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks]
  );

  return {
    hasHydrated,
    calendarEvents,
    handleEventDateChange,
    handleEventClick,
    handleDateClick,
    selectedTask,
    clearSelectedTask: () => setSelectedTaskId(null),
    dialogCalendarDate,
    isTaskDialogOpen,
    handleTaskDialogOpenChange,
  };
};
