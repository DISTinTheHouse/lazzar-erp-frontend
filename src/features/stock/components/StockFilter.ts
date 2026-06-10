import { getStockStatus, type StockStatus } from "./StockColumns";
import type { DataTableFilterConfig } from "@/src/components/DataTable";
import type { StockItem } from "../interfaces/stock.interface";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Enriquece los items de stock con una propiedad `estado` computada
 * para que el sistema de filtros de DataTable pueda filtrar por nivel de stock.
 */
export function enrichStockWithStatus(
  items: StockItem[],
  maxStock: number,
): (StockItem & { estado: StockStatus })[] {
  return items.map((item) => ({
    ...item,
    estado: getStockStatus(item.stock, maxStock),
  }));
}

/** Construye las opciones de almacén a partir de los items de stock. */
function buildWarehouseOptions(
  items: StockItem[],
): { value: string; label: string }[] {
  const map = new Map<number, string>();
  for (const item of items) {
    const id = item.almacen;
    const nombre = item.almacen_info?.nombre;
    if (id != null && nombre && !map.has(id)) {
      map.set(id, nombre);
    }
  }
  return Array.from(map.entries())
    .sort(([, a], [, b]) => a.localeCompare(b))
    .map(([id, nombre]) => ({
      value: String(id),
      label: nombre,
    }));
}

// ─── Factory de configuración de filtros ─────────────────────────────────────

/**
 * Crea la configuración de filtros para la tabla de existencias.
 * Debe llamarse dentro de un `useMemo` con los items como dependencia.
 */
export function createStockFilterConfig(
  items: StockItem[],
): DataTableFilterConfig[] {
  return [
    {
      id: "almacen",
      label: "Almacén",
      options: buildWarehouseOptions(items),
    },
    {
      id: "estado",
      label: "Estado",
      options: [
        { value: "full", label: "Óptimo" },
        { value: "ok", label: "Normal" },
        { value: "low", label: "Bajo" },
        { value: "critical", label: "Crítico" },
      ],
    },
  ];
}
