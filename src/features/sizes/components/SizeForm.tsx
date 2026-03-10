"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SizeFormSchema, SizeFormValues } from "../schemas/size.schema";
import { FormInput } from "../../../components/FormInput";
import { FormCancelButton, FormSubmitButton } from "../../../components/FormButtons";
import { SizesIcon } from "../../../components/Icons";
import { useCreateSize } from "../hooks/useCreateSize";
import { useUpdateSize } from "../hooks/useUpdateSize";
import { Size } from "../interfaces/size.interface";

interface SizeFormProps {
  onSuccess: () => void;
  sizeToEdit?: Size | null;
}

export default function SizeForm({ onSuccess, sizeToEdit }: SizeFormProps) {
  const isEditing = Boolean(sizeToEdit?.id);
  const emptyValues: SizeFormValues = {
    nombre: "",
  };
  const editValues: SizeFormValues = sizeToEdit
    ? {
        nombre: sizeToEdit.nombre,
      }
    : emptyValues;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SizeFormValues>({
    resolver: zodResolver(SizeFormSchema),
    defaultValues: emptyValues,
    values: isEditing ? editValues : undefined,
  });

  const { mutateAsync: createSize, isPending: isCreating } = useCreateSize(setError);
  const { mutateAsync: updateSize, isPending: isUpdating } = useUpdateSize(setError);
  const [isLoading, setIsLoading] = useState(false);
  const isPending = isCreating || isUpdating || isLoading;

  const onSubmit = async (data: SizeFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        nombre: data.nombre.toUpperCase(),
      };
      if (isEditing && sizeToEdit) {
        await updateSize({ id: sizeToEdit.id, ...payload });
      } else {
        await createSize(payload);
      }
      onSuccess();
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
              <SizesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg">
                Información General
              </h3>
              <p className="text-xs text-slate-500">Datos base de la talla</p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group/field md:col-span-2">
                <FormInput
                  label="Nombre de la Talla"
                  placeholder="Ej. M, L, XL"
                  variant="ghost"
                  className="text-3xl font-bold"
                  {...register("nombre")}
                  error={errors.nombre}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pb-8 mt-8">
          <FormCancelButton onClick={() => reset()} disabled={isPending} />
          <FormSubmitButton isPending={isPending} loadingLabel="Guardando...">
            {sizeToEdit ? "Actualizar Talla" : "Registrar Talla"}
          </FormSubmitButton>
        </div>
      </fieldset>
    </form>
  );
}
