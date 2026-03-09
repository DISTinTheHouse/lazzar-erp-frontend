import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";
import { ClientesIcon, TrendingUpIcon, CheckCircleIcon, ClockIcon } from "@/src/components/Icons";

export const CustomerStats = () => {
  const items: KpiItem[] = [
    {
      label: "Clientes Activos",
      value: "482",
      icon: ClientesIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+6.1%",
      status: "positive",
    },
    {
      label: "Nuevos este mes",
      value: "64",
      icon: TrendingUpIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "+18",
      status: "positive",
    },
    {
      label: "Retención",
      value: "86%",
      icon: CheckCircleIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "94%",
      status: "positive",
    },
    {
      label: "Seguimientos Hoy",
      value: "36",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "12",
      status: "neutral",
    },
  ];

  return <KpiGrid items={items} />;
};
