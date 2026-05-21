import type { OperationsQuote } from "../interfaces/operations-quote.interface";
import type { OperationsQuoteStockDetail } from "../interfaces/operations-quote-stock-detail.interface";

// Estado de disponibilidad de stock: completo, parcial o sin stock.
export type StockAvailability = "full" | "partial" | "none";

// Extiende la partida de detalle con una clave estable para listas React.
// La clave combina producto + color + índice para evitar colisiones entre variantes.
export interface NormalizedOperationsQuoteStockDetail extends OperationsQuoteStockDetail {
  key: string;
}

// Props del diálogo de revisión de inventario de cotizaciones de operaciones.
export interface OperationsQuoteStockReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operationsQuote: OperationsQuote;
}
