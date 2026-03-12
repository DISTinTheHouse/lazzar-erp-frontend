import { ExistenciasIcon, TrendingUpIcon, ClockIcon, ErrorIcon } from "@/src/components/Icons";
import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";

export const StockStats = () => {
  const items: KpiItem[] = [
    {
      label: "SKU Activos",
      value: "1,284",
      icon: ExistenciasIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+6.3%",
      status: "positive",
    },
    {
      label: "Nivel de Servicio",
      value: "Óptimo",
      icon: TrendingUpIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "92%",
      status: "positive",
    },
    {
      label: "Órdenes en Tránsito",
      value: "347",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "18",
      status: "neutral",
    },
    {
      label: "Alertas Críticas",
      value: "64",
      icon: ErrorIcon,
      iconBgClass: "bg-red-50 dark:bg-red-500/10",
      iconClass: "text-red-500",
      trendLabel: "9",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
