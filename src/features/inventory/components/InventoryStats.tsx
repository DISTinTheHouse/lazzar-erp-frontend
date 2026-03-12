import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";
import {
  InventariosIcon,
  ListaPreciosIcon,
  RecepcionesIcon,
  ErrorIcon,
} from "@/src/components/Icons";

export const InventoryStats = () => {
  const items: KpiItem[] = [
    {
      label: "Total Productos",
      value: "3,450",
      icon: InventariosIcon,
      iconBgClass: "bg-indigo-50 dark:bg-indigo-500/10",
      iconClass: "text-indigo-500",
      trendLabel: "+150",
      status: "positive",
    },
    {
      label: "Bajo Stock",
      value: "12 Items",
      icon: ErrorIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "12",
      status: "negative",
    },
    {
      label: "Valor Inventario",
      value: "$1.2M",
      icon: ListaPreciosIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "+8.5%",
      status: "positive",
    },
    {
      label: "Movimientos (Hoy)",
      value: "145",
      icon: RecepcionesIcon,
      iconBgClass: "bg-purple-50 dark:bg-purple-500/10",
      iconClass: "text-purple-500",
      trendLabel: "+24",
      status: "positive",
    },
  ];

  return <KpiGrid items={items} />;
};
