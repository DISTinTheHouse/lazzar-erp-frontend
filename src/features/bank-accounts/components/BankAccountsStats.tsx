import { BancosIcon, ClockIcon, ErrorIcon, ListaPreciosIcon } from "@/src/components/Icons";
import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";

export const BankAccountsStats = () => {
  const items: KpiItem[] = [
    {
      label: "Cuentas Bancarias",
      value: "12",
      icon: BancosIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+3",
      status: "positive",
    },
    {
      label: "Pendientes Conciliación",
      value: "$45,200",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "5",
      status: "neutral",
    },
    {
      label: "Saldo Total",
      value: "$1,245,730",
      icon: ListaPreciosIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "+2.3%",
      status: "positive",
    },
    {
      label: "Alertas",
      value: "Sobregiro",
      icon: ErrorIcon,
      iconBgClass: "bg-red-50 dark:bg-red-500/10",
      iconClass: "text-red-500",
      trendLabel: "1",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
