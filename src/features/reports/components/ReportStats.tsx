import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";
import { ReportesIcon, TrendingUpIcon, ClockIcon, ErrorIcon } from "@/src/components/Icons";

export const ReportStats = () => {
  const items: KpiItem[] = [
    {
      label: "Reportes Generados",
      value: "128",
      icon: ReportesIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+8.2%",
      status: "positive",
    },
    {
      label: "Programados",
      value: "36",
      icon: TrendingUpIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "14",
      status: "positive",
    },
    {
      label: "En Proceso",
      value: "12",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "5",
      status: "neutral",
    },
    {
      label: "Fallidos",
      value: "6",
      icon: ErrorIcon,
      iconBgClass: "bg-rose-50 dark:bg-rose-500/10",
      iconClass: "text-rose-500",
      trendLabel: "2",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
