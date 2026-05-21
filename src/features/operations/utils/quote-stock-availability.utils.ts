import type {
  OperationsQuoteStockDetail,
  OperationsQuoteStockDetailSize,
} from "../interfaces/operations-quote-stock-detail.interface";
import type { StockAvailability } from "../types/quote-stock-review.types";

// Mapa de estilos visuales por estado de disponibilidad.
// Cubre bordes y fondos de tarjeta, filas de tabla, badge de estado, etiqueta e ícono.
export const availabilityStyles: Record<
  StockAvailability,
  {
    card: string;
    row: string;
    badge: string;
    label: string;
    iconClass: string;
  }
> = {
  full: {
    card: "border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-900/10",
    row: "bg-emerald-50/40 dark:bg-emerald-900/10",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    label: "Disponible",
    iconClass: "text-emerald-500",
  },
  partial: {
    card: "border-amber-200/70 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-900/10",
    row: "bg-amber-50/40 dark:bg-amber-900/10",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    label: "Parcial",
    iconClass: "text-amber-500",
  },
  none: {
    card: "border-rose-200/70 bg-rose-50/40 dark:border-rose-500/20 dark:bg-rose-900/10",
    row: "bg-rose-50/40 dark:bg-rose-900/10",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    label: "Sin stock",
    iconClass: "text-rose-500",
  },
};

// Determina el estado de disponibilidad de una talla específica comparando
// stock disponible contra cantidad pedida por el cliente.
export function getSizeAvailability(
  stockSize: OperationsQuoteStockDetailSize
): StockAvailability {
  if (stockSize.stock_actual >= stockSize.cantidad_pedida) {
    return "full";
  }

  if (stockSize.stock_actual === 0) {
    return "none";
  }

  return "partial";
}

// Determina el estado de disponibilidad de un grupo (producto + color) a partir de sus tallas:
// full si todas disponibles, none si ninguna tiene stock, partial en cualquier otro caso.
export function getGroupAvailability(
  stockDetail: OperationsQuoteStockDetail
): StockAvailability {
  const sizeAvailabilities = stockDetail.tallas.map(getSizeAvailability);

  if (sizeAvailabilities.every((availability) => availability === "full")) {
    return "full";
  }

  if (sizeAvailabilities.every((availability) => availability === "none")) {
    return "none";
  }

  return "partial";
}
