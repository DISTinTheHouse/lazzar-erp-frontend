import { CxcIcon, ClockIcon, ErrorIcon, ListaPreciosIcon } from "@/src/components/Icons";
import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";

export const AccountsReceivableStats = () => {
  const items: KpiItem[] = [
    {
      label: "Cuentas por Cobrar",
      value: "$412,300",
      icon: CxcIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+9.8%",
      status: "positive",
    },
    {
      label: "Facturas Pendientes",
      value: "$135,750",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "18",
      status: "neutral",
    },
    {
      label: "Cobrado del Mes",
      value: "$276,550",
      icon: ListaPreciosIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "72%",
      status: "positive",
    },
    {
      label: "Vencidas",
      value: "$29,450",
      icon: ErrorIcon,
      iconBgClass: "bg-red-50 dark:bg-red-500/10",
      iconClass: "text-red-500",
      trendLabel: "6",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
