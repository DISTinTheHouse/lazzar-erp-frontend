import { ContabilidadIcon, ListaPreciosIcon, ErrorIcon, ClockIcon } from "@/src/components/Icons";
import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";

export const AccountingStats = () => {
  const items: KpiItem[] = [
    {
      label: "Pólizas del Mes",
      value: "320",
      icon: ContabilidadIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+24",
      status: "positive",
    },
    {
      label: "Pendientes Conciliar",
      value: "$185,430",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "18",
      status: "neutral",
    },
    {
      label: "CFDI Vinculados",
      value: "1,245",
      icon: ListaPreciosIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "98.7%",
      status: "positive",
    },
    {
      label: "Inconsistencias",
      value: "$12,890",
      icon: ErrorIcon,
      iconBgClass: "bg-red-50 dark:bg-red-500/10",
      iconClass: "text-red-500",
      trendLabel: "4",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
