"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCategoryFormSchema, ProductCategoryFormValues } from "../schemas/product-category.schema";
import { FormInput } from "../../../components/FormInput";
import { FormCancelButton, FormSubmitButton } from "../../../components/FormButtons";
import { ProductCategoriesIcon } from "../../../components/Icons";
import { useWorkspaceStore } from "../../workspace/store/workspace.store";
import { useCreateProductCategory } from "../hooks/useCreateProductCategory";
import { useUpdateProductCategory } from "../hooks/useUpdateProductCategory";
import { ProductCategory } from "../interfaces/product-category.interface";

interface ProductCategoryFormProps {
  onSuccess: () => void;
  categoryToEdit?: ProductCategory | null;
}

export default function ProductCategoryForm({ onSuccess, categoryToEdit }: ProductCategoryFormProps) {
  const selectedCompany = useWorkspaceStore((state) => state.selectedCompany);
  const isEditing = Boolean(categoryToEdit?.id);
  const emptyValues: ProductCategoryFormValues = {
    nombre: "",
    codigo: "",
    descripcion: "",
  };
  const editValues: ProductCategoryFormValues = categoryToEdit
    ? {
        nombre: categoryToEdit.nombre,
        codigo: categoryToEdit.codigo,
        descripcion: categoryToEdit.descripcion ?? "",
      }
    : emptyValues;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(ProductCategoryFormSchema),
    defaultValues: emptyValues,
    values: isEditing ? editValues : undefined,
  });

  const { mutateAsync: createCategory, isPending: isCreating } = useCreateProductCategory(setError);
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateProductCategory(setError);
  const [isLoading, setIsLoading] = useState(false);
  const isPending = isCreating || isUpdating || isLoading;

  const onSubmit = async (data: ProductCategoryFormValues) => {
    setIsLoading(true);
    try {
      const descripcion = data.descripcion?.trim() ?? "";

      if (isEditing && categoryToEdit) {
        await updateCategory({
          id: categoryToEdit.id,
          empresa: categoryToEdit.empresa ?? selectedCompany.id!,
          nombre: data.nombre,
          codigo: data.codigo,
          descripcion,
        });
        reset(editValues);
      } else {
        await createCategory({
          empresa: selectedCompany.id!,
          nombre: data.nombre,
          codigo: data.codigo,
          descripcion,
        });
        reset(emptyValues);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
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
              <ProductCategoriesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg">
                Información General
              </h3>
              <p className="text-xs text-slate-500">Datos base de la categoría</p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group/field md:col-span-2">
                <FormInput
                  label="Nombre de la Categoría"
                  placeholder="Ej. Camisas"
                  variant="ghost"
                  className="text-3xl font-bold"
                  {...register("nombre")}
                  error={errors.nombre}
                />
              </div>

              <div className="group/field">
                <div className="relative">
                  <div className="absolute left-3 top-9 text-slate-400 font-mono text-sm">#</div>
                  <FormInput
                    label="Código"
                    placeholder="Ej. CAT-001"
                    className="pl-8 font-mono"
                    {...register("codigo")}
                    error={errors.codigo}
                  />
                </div>
              </div>

              <div className="group/field md:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block transition-colors group-focus-within:text-sky-500">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe la categoría"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all dark:text-white resize-none"
                  {...register("descripcion")}
                />
                {errors.descripcion && (
                  <p className="text-xs text-red-600 mt-1">{errors.descripcion.message}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pb-8 mt-8">
          <FormCancelButton onClick={() => reset(isEditing ? editValues : emptyValues)} disabled={isPending} />
          <FormSubmitButton isPending={isPending} loadingLabel={isEditing ? "Actualizando..." : "Guardando..."}>
            {isEditing ? "Actualizar Categoría" : "Registrar Categoría"}
          </FormSubmitButton>
        </div>
      </fieldset>
    </form>
  );
}
