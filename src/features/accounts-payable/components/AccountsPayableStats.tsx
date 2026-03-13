import { CxpIcon, ClockIcon, ErrorIcon, ListaPreciosIcon } from "@/src/components/Icons";
import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";

export const AccountsPayableStats = () => {
  const items: KpiItem[] = [
    {
      label: "Cuentas por Pagar",
      value: "$325,890",
      icon: CxpIcon,
      iconBgClass: "bg-sky-50 dark:bg-sky-500/10",
      iconClass: "text-sky-500",
      trendLabel: "+12.4%",
      status: "positive",
    },
    {
      label: "Facturas Pendientes",
      value: "$120,450",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "24",
      status: "neutral",
    },
    {
      label: "Pagado del Mes",
      value: "$210,300",
      icon: ListaPreciosIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "65%",
      status: "positive",
    },
    {
      label: "Vencidas",
      value: "$32,780",
      icon: ErrorIcon,
      iconBgClass: "bg-red-50 dark:bg-red-500/10",
      iconClass: "text-red-500",
      trendLabel: "8",
      status: "negative",
    },
  ];

  return <KpiGrid items={items} />;
};
