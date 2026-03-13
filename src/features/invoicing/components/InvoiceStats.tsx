import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";
import { ErrorIcon, ListaPreciosIcon, FacturacionIcon, ClockIcon } from "../../../components/Icons";

export const InvoiceStats = () => {
  const items: KpiItem[] = [
    {
      label: "Facturado (Mes)",
      value: "$452,890",
      icon: ListaPreciosIcon,
      iconBgClass: "bg-blue-50 dark:bg-blue-500/10",
      iconClass: "text-blue-500",
      trendLabel: "+18.2%",
      status: "positive",
    },
    {
      label: "Por Cobrar",
      value: "$85,200",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "5 Pendientes",
      status: "neutral",
    },
    {
      label: "Vencido",
      value: "$12,450",
      icon: ErrorIcon,
      iconBgClass: "bg-red-50 dark:bg-red-500/10",
      iconClass: "text-red-500",
      trendLabel: "2 Vencidas",
      status: "negative",
    },
    {
      label: "Facturas Emitidas",
      value: "128",
      icon: FacturacionIcon,
      iconBgClass: "bg-purple-50 dark:bg-purple-500/10",
      iconClass: "text-purple-500",
      trendLabel: "+4.5%",
      status: "positive",
    },
  ];

  return <KpiGrid items={items} />;
};
