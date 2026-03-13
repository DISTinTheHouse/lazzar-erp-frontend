import { ListaPreciosIcon, TrendingUpIcon, ClockIcon, CheckCircleIcon } from "@/src/components/Icons";
import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";

export const PriceListStats = () => {
  const items: KpiItem[] = [
    {
      label: "Listas Activas",
      value: "18",
      icon: ListaPreciosIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+3.1%",
      status: "positive",
    },
    {
      label: "Ajustes Semana",
      value: "72",
      icon: TrendingUpIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "24",
      status: "positive",
    },
    {
      label: "Revisión Pendiente",
      value: "12",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "5",
      status: "neutral",
    },
    {
      label: "Margen Promedio",
      value: "27.9%",
      icon: CheckCircleIcon,
      iconBgClass: "bg-indigo-50 dark:bg-indigo-500/10",
      iconClass: "text-indigo-500",
      trendLabel: "28.4%",
      status: "positive",
    },
  ];

  return <KpiGrid items={items} />;
};
