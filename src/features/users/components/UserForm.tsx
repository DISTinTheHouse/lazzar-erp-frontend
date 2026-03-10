"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormSchema, UserFormValues } from "../schemas/user.schema";
import { useRegisterUser } from "../hooks/useRegisterUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import MissingPrerequisites from "../../products/components/MissingPrerequisites";
import { FormInput } from "../../../components/FormInput";
import { FormSelect } from "../../../components/FormSelect";
import { FormCancelButton, FormSubmitButton } from "../../../components/FormButtons";
import { FormToggle } from "../../../components/FormToggle";
import { Loader } from "../../../components/Loader";
import { useWorkspaceStore } from "../../workspace/store/workspace.store";
import { useCompanyBranches } from "../../branches/hooks/useCompanyBranches";
import { UserIcon, MapPinIcon } from "../../../components/Icons";
import { User } from "../interfaces/user.interface";
import { useRoles } from "../../roles/hooks/useRoles";

interface UserFormProps {
  onSuccess: () => void;
  defaultValues?: User;
}

export default function UserForm({ onSuccess, defaultValues }: UserFormProps) {
  const companyId = useWorkspaceStore((state) => state.selectedCompany.id);
  const selectedBranchId = useWorkspaceStore((state) => state.selectedBranch!.id);
  const { branches, isLoading: isLoadingBranches } = useCompanyBranches(companyId);
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  const isEditing = Boolean(defaultValues?.id);
  const emptyValues: UserFormValues = {
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    sucursal_default: selectedBranchId,
    sucursales: [],
    roles: [],
    is_active: true,
  };

  const editValues: UserFormValues = defaultValues
    ? {
        username: defaultValues.username,
        email: defaultValues.email,
        password: "",
        first_name: defaultValues.first_name,
        last_name: defaultValues.last_name,
        sucursal_default: defaultValues.sucursal_default,
        sucursales: Array.isArray(defaultValues.sucursales)
          ? defaultValues.sucursales.map((id) => Number(id))
          : [],
        roles: Array.isArray(defaultValues.roles_ids)
          ? defaultValues.roles_ids.map((id) => Number(id))
          : [],
        is_active: defaultValues.is_active,
      }
    : emptyValues;

  const activeRoles = roles.filter((role) => (role.estatus || "").toLowerCase() === "activo");
  const missingItems = [
    branches.length === 0 && !isLoadingBranches ? "Sucursales" : null,
    activeRoles.length === 0 && !isLoadingRoles ? "Roles activos" : null,
  ].filter((item): item is string => Boolean(item));

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema) as Resolver<UserFormValues>,
    defaultValues: emptyValues,
    values: isEditing ? editValues : undefined,
  });

  const { mutateAsync: registerUser, isPending: isRegisterPending } = useRegisterUser(setError);
  const { mutateAsync: updateUser, isPending: isUpdatePending } = useUpdateUser(setError);
  const [isSaving, setIsSaving] = useState(false);
  const isPending = isSaving || isRegisterPending || isUpdatePending;
  const isActive = watch("is_active");
  const isLoadingData = isLoadingBranches || isLoadingRoles;

  const onSubmit = async (values: UserFormValues) => {
    setIsSaving(true);
    try {
      if (isEditing && defaultValues) {
        await updateUser({
          id: defaultValues.id,
          values,
        });
        reset(editValues);
        onSuccess();
        return;
      }

      await registerUser(values);
      reset(emptyValues);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="py-10">
        <Loader title="Cargando formulario" message="Preparando sucursales y roles..." />
      </div>
    );
  }

  if (missingItems.length > 0) {
    return <MissingPrerequisites items={missingItems} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isPending} className={`space-y-8 transition-opacity duration-200 ${isPending ? "opacity-60" : ""}`}>
        <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 bg-slate-50/50 dark:bg-white/2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg">
                Información Personal
              </h3>
              <p className="text-xs text-slate-500">Datos básicos del usuario</p>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput
                label="Nombre de Usuario"
                placeholder="usuario123"
                className="text-2xl font-bold"
                variant="ghost"
                {...register("username")}
                error={errors.username}
              />

              <FormInput
                label="Email"
                type="email"
                placeholder="usuario@empresa.com"
                {...register("email")}
                error={errors.email}
              />

              <FormInput
                label="Nombre"
                placeholder="Juan"
                {...register("first_name")}
                error={errors.first_name}
              />

              <FormInput
                label="Apellido"
                placeholder="Pérez"
                {...register("last_name")}
                error={errors.last_name}
              />

              <FormInput
                label="Contraseña"
                type="password"
                placeholder="********"
                {...register("password")}
                error={errors.password}
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 bg-slate-50/50 dark:bg-white/2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <MapPinIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg">
                Sucursales
              </h3>
              <p className="text-xs text-slate-500">Asignación y permisos de acceso</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <FormSelect
              label="Sucursal Principal"
              {...register("sucursal_default")}
              error={errors.sucursal_default}
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">
                  {branch.nombre}
                </option>
              ))}
            </FormSelect>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                Roles
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeRoles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors bg-slate-50/50 dark:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      value={role.id}
                      {...register("roles")}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {role.nombre}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.roles && (
                <p className="text-xs text-red-600 mt-1">{errors.roles.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                Acceso a Sucursales
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {branches.map((branch) => (
                  <label
                    key={branch.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors bg-slate-50/50 dark:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      value={branch.id}
                      {...register("sucursales")}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {branch.nombre}
                    </span>
                  </label>
                ))}
              </div>
              {errors.sucursales && (
                <p className="text-xs text-red-600 mt-1">{errors.sucursales.message}</p>
              )}
            </div>

            <div className="mt-4 w-full md:max-w-3/4 lg:max-w-1/2">
              <FormToggle
                label="Estado"
                description={
                  isActive
                    ? "Usuario activo para operar en el sistema"
                    : "Usuario inactivo temporalmente"
                }
                {...register("is_active", { setValueAs: (value) => Boolean(value) })}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <FormCancelButton
            onClick={() =>
              reset((isEditing ? editValues : emptyValues) as UserFormValues)
            }
            disabled={isPending}
          />
          <FormSubmitButton
            isPending={isPending}
            loadingLabel={isEditing ? "Actualizando..." : "Registrando..."}
          >
            {isEditing ? "Actualizar Usuario" : "Registrar Usuario"}
          </FormSubmitButton>
        </div>
      </fieldset>
    </form>
  );
}
