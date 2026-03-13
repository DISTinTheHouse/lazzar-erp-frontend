import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";
import { TrendingUpIcon, ClockIcon, BuildingIcon, ErrorIcon } from "../../../components/Icons";

export const ProductionStats = () => {
  const items: KpiItem[] = [
    {
      label: "Producción Activa",
      value: "8 OP",
      icon: BuildingIcon,
      iconBgClass: "bg-blue-50 dark:bg-blue-500/10",
      iconClass: "text-blue-500",
      trendLabel: "+12.5%",
      status: "positive",
    },
    {
      label: "En Espera",
      value: "1,250 u",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "3",
      status: "neutral",
    },
    {
      label: "Eficiencia",
      value: "98.2%",
      icon: TrendingUpIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "94%",
      status: "positive",
    },
    {
      label: "Retrasos",
      value: "2 OP",
      icon: ErrorIcon,
      iconBgClass: "bg-red-50 dark:bg-red-500/10",
      iconClass: "text-red-500",
      trendLabel: "2",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
