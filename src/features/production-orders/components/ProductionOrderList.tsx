"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/src/components/DataTable";
import { getProductionOrderColumns } from "./ProductionOrderColumns";
import { MOCK_PRODUCTION_ORDERS } from "../mocks/production-order.mock";
import {
  PRODUCTION_ORDER_STEPS,
  PRODUCTION_ORDER_STATUS_LABELS,
  type ProductionOrderStatus,
} from "../interfaces/production-order.interface";

// Valor posible para el filtro de pestañas (incluye estados especiales y "todas")
type ProductionOrderFilterValue = ProductionOrderStatus | 'todas';

// Pestañas de filtro — "Todas", cada paso canónico, estados especiales y canceladas
const FILTROS: { value: ProductionOrderFilterValue; label: string }[] = [
  { value: 'todas',                label: 'Todas' },
  ...PRODUCTION_ORDER_STEPS.map((s) => ({
    value:  s as ProductionOrderStatus,
    label:  PRODUCTION_ORDER_STATUS_LABELS[s],
  })),
  { value: 'material_faltante',    label: 'Material Faltante' },
  { value: 'comprando_materiales', label: 'Comprando Materiales' },
  { value: 'cancelada',            label: 'Canceladas' },
];

const FILTRO_DEFAULT_ACTIVE = 'bg-sky-600 text-white';


/** Lista principal de órdenes de producción */
export function ProductionOrderList() {
  const [filtroEstatus, setFiltroEstatus] = useState<ProductionOrderFilterValue>('todas');

  const columns = useMemo(() => getProductionOrderColumns(), []);

  const ordenesFiltradas = useMemo(() => {
    if (filtroEstatus === 'todas') return MOCK_PRODUCTION_ORDERS;
    return MOCK_PRODUCTION_ORDERS.filter((o) => o.estatus === filtroEstatus);
  }, [filtroEstatus]);

  return (
    <div className="space-y-5">

      {/* ── Filtros de estatus / paso del flujo ──────────────────────── */}
      <div
        className="flex items-center gap-1.5 flex-wrap"
        role="group"
        aria-label="Filtrar por estatus del flujo de producción"
      >
        {FILTROS.map((f) => {
          const count =
            f.value === 'todas'
              ? MOCK_PRODUCTION_ORDERS.length
              : MOCK_PRODUCTION_ORDERS.filter((o) => o.estatus === f.value).length;

          if (count === 0 && f.value !== 'todas') return null;

          const isActive = filtroEstatus === f.value;
          const activeCls = FILTRO_DEFAULT_ACTIVE;

          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFiltroEstatus(f.value)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? `${activeCls} shadow-sm`
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {f.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Tabla principal ───────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={ordenesFiltradas}
        baseDataCount={MOCK_PRODUCTION_ORDERS.length}
        searchPlaceholder="Buscar folio, producto, área…"
      />
    </div>
  );
}
