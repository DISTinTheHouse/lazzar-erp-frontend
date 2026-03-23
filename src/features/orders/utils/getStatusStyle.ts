import { Order } from "../interfaces/order.interface";

export const getOrderStatusLabel = (isActive: Order["activo"] | null | undefined) =>
  isActive ? "Activo" : "Inactivo";

export const getStatusStyles = (isActive: Order["activo"] | null | undefined) =>
  isActive
    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
    : "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400";
