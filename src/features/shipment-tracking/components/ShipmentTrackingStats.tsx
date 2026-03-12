import { RastrearGuiasIcon, TrendingUpIcon, ClockIcon, ErrorIcon } from "@/src/components/Icons";
import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";

export const ShipmentTrackingStats = () => {
  const items: KpiItem[] = [
    {
      label: "Guías en Seguimiento",
      value: "1,046",
      icon: RastrearGuiasIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+4.8%",
      status: "positive",
    },
    {
      label: "Entregas a Tiempo",
      value: "842",
      icon: TrendingUpIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "96%",
      status: "positive",
    },
    {
      label: "ETA en Riesgo",
      value: "128",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "32",
      status: "neutral",
    },
    {
      label: "Incidencias Abiertas",
      value: "19",
      icon: ErrorIcon,
      iconBgClass: "bg-rose-50 dark:bg-rose-500/10",
      iconClass: "text-rose-500",
      trendLabel: "7",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
