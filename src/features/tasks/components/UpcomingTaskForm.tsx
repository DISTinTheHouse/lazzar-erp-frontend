"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../../../components/FormInput";
import { FormTextarea } from "../../../components/FormTextarea";
import { FormCancelButton, FormSubmitButton } from "../../../components/FormButtons";
import { ClockIcon } from "../../../components/Icons";
import { UpcomingTaskFormSchema, UpcomingTaskFormValues } from "../schemas/upcoming-task.schema";
import { useUpcomingTasksStore } from "../stores/upcoming-tasks.store";
import { UpcomingTask } from "../interfaces/upcoming-task.interface";
import { normalizeDate } from "@/src/utils/normalizeDate";
import { toInputDateTime } from "@/src/utils/toInputDateTime";

interface UpcomingTaskFormProps {
  onSuccess: () => void;
  taskToEdit?: UpcomingTask | null;
  defaultCalendarDate?: Date | null;
  dialogOpen?: boolean;
}


const buildDefaultDueDate = (defaultCalendarDate: Date | null | undefined) => {
  const now = new Date();
  if (defaultCalendarDate) {
    const calendarDateWithCurrentHour = new Date(defaultCalendarDate);
    calendarDateWithCurrentHour.setHours(now.getHours(), now.getMinutes(), 0, 0);
    return toInputDateTime(calendarDateWithCurrentHour.toISOString());
  }
  return toInputDateTime(now.toISOString());
};

export default function UpcomingTaskForm({
  onSuccess,
  taskToEdit,
  defaultCalendarDate,
  dialogOpen = false,
}: UpcomingTaskFormProps) {
  const addTask = useUpcomingTasksStore((state) => state.addTask);
  const updateTask = useUpcomingTasksStore((state) => state.updateTask);

  const isEditing = Boolean(taskToEdit?.id);
  const currentDateTime = useMemo(() => buildDefaultDueDate(defaultCalendarDate), [defaultCalendarDate]);
  const emptyValues: UpcomingTaskFormValues = useMemo(
    () => ({
      title: "",
      shortDescription: "",
      comments: "",
      dueDate: currentDateTime,
    }),
    [currentDateTime]
  );

  const editValues: UpcomingTaskFormValues = taskToEdit
    ? { // Valores para editar una tarea existente
        title: taskToEdit.title,
        shortDescription: taskToEdit.shortDescription,
        comments: taskToEdit.comments ?? "",
        dueDate: toInputDateTime(taskToEdit.dueDate),
      }
    : emptyValues;

  const { // Configuración del formulario
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpcomingTaskFormValues>({
    resolver: zodResolver(UpcomingTaskFormSchema) as Resolver<UpcomingTaskFormValues>,
    defaultValues: emptyValues,
    values: isEditing ? editValues : undefined,
  });

  useEffect(() => {
    if (isEditing || !dialogOpen) return;
    reset(emptyValues);
  }, [dialogOpen, emptyValues, isEditing, reset]);

  // Manejo del estado de carga
  const [isLoading, setIsLoading] = useState(false);
  const isPending = isLoading;

  // Manejo de la submisión del formulario
  const onSubmit = async (values: UpcomingTaskFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        title: values.title.trim(),
        shortDescription: values.shortDescription.trim(),
        comments: values.comments?.trim() || undefined,
        dueDate: normalizeDate(values.dueDate),
      };

      if (isEditing && taskToEdit) { // Actualización de una tarea existente
        updateTask({
          id: taskToEdit.id,
          ...payload,
        });
        reset(editValues);
        onSuccess();
        return;
      }

      addTask(payload); // Adición de una nueva tarea
      reset(emptyValues); // Restablecimiento del formulario a valores vacíos
      onSuccess(); // Llamada al callback de éxito
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <fieldset disabled={isPending} className="group-disabled:opacity-50">
        <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-8">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 bg-slate-50/50 dark:bg-white/2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg">
                Información de la tarea
              </h3>
              <p className="text-xs text-slate-500">Datos de seguimiento y programación</p>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group/field md:col-span-2">
                <FormInput
                  label="Título"
                  placeholder="Ej. Llamada con cliente X"
                  className="text-2xl font-bold"
                  variant="ghost"
                  {...register("title")}
                  error={errors.title}
                />
              </div>

              <div className="md:col-span-2">
                <FormInput
                  label="Descripción corta"
                  placeholder="Resumen breve de la tarea"
                  {...register("shortDescription")}
                  error={errors.shortDescription}
                />
              </div>

              <div className="md:col-span-2">
                <FormTextarea
                  label="Comentarios"
                  rows={3}
                  placeholder="Detalles adicionales"
                  {...register("comments")}
                  error={errors.comments}
                />
              </div>

              <div className="md:col-span-2">
                <FormInput
                  label="Fecha y hora (GMT-6)"
                  type="datetime-local"
                  className="dark:scheme-dark"
                  {...register("dueDate")}
                  error={errors.dueDate}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-end">
          <FormCancelButton
            onClick={() => reset(isEditing ? editValues : emptyValues)}
            disabled={isPending}
          />
          <FormSubmitButton
            isPending={isPending}
            loadingLabel={isEditing ? "Actualizando..." : "Guardando..."}
          >
            {isEditing ? "Actualizar Tarea" : "Registrar Tarea"}
          </FormSubmitButton>
        </div>
      </fieldset>
    </form>
  );
}
