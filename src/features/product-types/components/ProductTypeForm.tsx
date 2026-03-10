"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductTypeFormSchema, ProductTypeFormValues } from "../schemas/product-type.schema";
import { FormInput } from "../../../components/FormInput";
import { FormCancelButton, FormSubmitButton } from "../../../components/FormButtons";
import { ProductTypesIcon } from "../../../components/Icons";
import { useCreateProductType } from "../hooks/useCreateProductType";
import { useUpdateProductType } from "../hooks/useUpdateProductType";
import { ProductType } from "../interfaces/product-type.interface";

interface ProductTypeFormProps {
  onSuccess: () => void;
  productTypeToEdit?: ProductType | null;
}

export default function ProductTypeForm({ onSuccess, productTypeToEdit }: ProductTypeFormProps) {
  const isEditing = Boolean(productTypeToEdit?.id);
  const emptyValues: ProductTypeFormValues = {
    codigo: "",
  };
  const editValues: ProductTypeFormValues = productTypeToEdit
    ? { codigo: productTypeToEdit.codigo }
    : emptyValues;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductTypeFormValues>({
    resolver: zodResolver(ProductTypeFormSchema),
    defaultValues: emptyValues,
    values: isEditing ? editValues : undefined,
  });

  const { mutateAsync: createProductType, isPending: isCreating } = useCreateProductType(setError);
  const { mutateAsync: updateProductType, isPending: isUpdating } = useUpdateProductType(setError);
  const [isLoading, setIsLoading] = useState(false);
  const isPending = isCreating || isUpdating || isLoading;

  const onSubmit = async (data: ProductTypeFormValues) => {
    setIsLoading(true);
    try {
      if (isEditing && productTypeToEdit) {
        await updateProductType({
          id: productTypeToEdit.id,
          codigo: data.codigo,
        });
        reset(editValues);
      } else {
        await createProductType({ codigo: data.codigo });
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
              <ProductTypesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg">
                Información General
              </h3>
              <p className="text-xs text-slate-500">Datos base del tipo de producto</p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group/field">
                <div className="relative">
                  <div className="absolute left-3 top-9 text-slate-400 font-mono text-sm">#</div>
                  <FormInput
                    label="Código"
                    placeholder="Ej. TIPO-01"
                    className="pl-8 font-mono"
                    {...register("codigo")}
                    error={errors.codigo}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pb-8 mt-8">
          <FormCancelButton onClick={() => reset(isEditing ? editValues : emptyValues)} disabled={isPending} />
          <FormSubmitButton isPending={isPending} loadingLabel={isEditing ? "Actualizando..." : "Guardando..."}>
            {isEditing ? "Actualizar Tipo" : "Registrar Tipo"}
          </FormSubmitButton>
        </div>
      </fieldset>
    </form>
  );
}
