import { EmbarquesIcon, TrendingUpIcon, ClockIcon, ErrorIcon } from "@/src/components/Icons";
import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";

export const ShipmentStats = () => {
  const items: KpiItem[] = [
    {
      label: "Embarques Programados",
      value: "86",
      icon: EmbarquesIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+3.6%",
      status: "positive",
    },
    {
      label: "Entregas a Tiempo",
      value: "312",
      icon: TrendingUpIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "92%",
      status: "positive",
    },
    {
      label: "En Ruta",
      value: "64",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "18",
      status: "neutral",
    },
    {
      label: "Incidencias",
      value: "14",
      icon: ErrorIcon,
      iconBgClass: "bg-rose-50 dark:bg-rose-500/10",
      iconClass: "text-rose-500",
      trendLabel: "6",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
