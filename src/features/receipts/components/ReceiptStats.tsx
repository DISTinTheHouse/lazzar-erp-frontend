import KpiGrid, { KpiItem } from "@/src/components/KpiGrid";
import { TrendingUpIcon, ClockIcon, CheckCircleIcon, InventariosIcon } from "../../../components/Icons";

export const ReceiptStats = () => {
  const items: KpiItem[] = [
    {
      label: "Recepciones Hoy",
      value: "24",
      icon: InventariosIcon,
      iconBgClass: "bg-blue-50 dark:bg-blue-500/10",
      iconClass: "text-blue-500",
      trendLabel: "+5.2%",
      status: "positive",
    },
    {
      label: "Pendientes de Descarga",
      value: "8",
      icon: ClockIcon,
      iconBgClass: "bg-amber-50 dark:bg-amber-500/10",
      iconClass: "text-amber-500",
      trendLabel: "3 Activas",
      status: "neutral",
    },
    {
      label: "Completadas (Semana)",
      value: "156",
      icon: CheckCircleIcon,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      iconClass: "text-emerald-500",
      trendLabel: "+12%",
      status: "positive",
    },
    {
      label: "Eficiencia Recepción",
      value: "High",
      icon: TrendingUpIcon,
      iconBgClass: "bg-purple-50 dark:bg-purple-500/10",
      iconClass: "text-purple-500",
      trendLabel: "98.5%",
      status: "positive",
    },
  ];

  return <KpiGrid items={items} />;
};
