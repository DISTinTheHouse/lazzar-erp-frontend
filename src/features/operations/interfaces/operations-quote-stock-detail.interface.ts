export interface OperationsQuoteStockDetailSize {
  talla: string;
  cantidad_pedida: number;
  stock_actual: number;
  diferencia: number;
}

export interface OperationsQuoteStockDetail {
  producto: string;
  color: string;
  tallas: OperationsQuoteStockDetailSize[];
}