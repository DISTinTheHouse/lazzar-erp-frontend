import type { DataTableFilterConfig } from "@/src/components/DataTable";

// ─── Configuración de filtros para DataTable ────────────────────────────────

export const purchaseOrdersFilterConfig: DataTableFilterConfig[] = [
  {
    id: "lifecycle_status",
    label: "Estado del ciclo de vida",
    options: [
      { value: "borrador", label: "Borrador" },
      { value: "pendiente", label: "Pendiente" },
      { value: "autorizada", label: "Autorizada" },
      { value: "en_transito", label: "En tránsito" },
      { value: "en_aduana", label: "En aduana" },
      { value: "en_camino_almacen", label: "En camino a almacén" },
      { value: "recibida", label: "Recibida" },
      { value: "completada", label: "Completada" },
      { value: "cancelada", label: "Cancelada" },
    ],
  },
];
