"use client";

import { useState } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ProductionOrderTimelineDialog } from "./ProductionOrderTimelineDialog";
import type { ProductionOrder, ProductionOrderPriority, ProductionOrderStatus } from "../interfaces/production-order.interface";
import {
  PRODUCTION_ORDER_STEPS,
  PRODUCTION_ORDER_STATUS_LABELS,
  PRODUCTION_ORDER_PRIORITY_LABELS,
} from "../interfaces/production-order.interface";
import { ActionMenu } from "@/src/components/ActionMenu";
import type { ActionMenuItem } from "@/src/components/ActionMenu";
import {
  ViewIcon,
  DeleteIcon,
  HistoryIcon,
  FactoryIcon,
  ComprasIcon,
  PackageCheckIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  RejectIcon,
  ExclamationTriangleIcon,
  DownloadIcon,
} from "@/src/components/Icons";

// ── Configuración visual de estatus ──────────────────────────────────────────

const ESTATUS_CFG: Record<ProductionOrderStatus, { cls: string; dot: string }> = {
  creada:                  { cls: 'bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300',            dot: 'bg-slate-400' },
  verificando_materiales:  { cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',            dot: 'bg-amber-500' },
  en_fabricacion:          { cls: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',                    dot: 'bg-sky-500' },
  registrando_avance:      { cls: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',        dot: 'bg-violet-500' },
  cierre_solicitado:       { cls: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',                dot: 'bg-teal-500' },
  cerrada:                 { cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',    dot: 'bg-emerald-500' },
  comprando_materiales:    { cls: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',        dot: 'bg-orange-500' },
  material_faltante:       { cls: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',                   dot: 'bg-red-500' },
  cancelada:               { cls: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-500/10 dark:text-zinc-400',               dot: 'bg-zinc-400' },
};

const PRIORIDAD_CFG: Record<ProductionOrderPriority, { cls: string; label: string }> = {
  alta:  { cls: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',         label: 'Alta' },
  media: { cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', label: 'Media' },
  baja:  { cls: 'bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400', label: 'Baja' },
};

// ── Sub-componentes de celda ──────────────────────────────────────────────────

/** Badge de estatus con indicador de color */
const EstatusBadge = ({ estatus }: { estatus: ProductionOrderStatus }) => {
  const cfg = ESTATUS_CFG[estatus];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} aria-hidden="true" />
      {PRODUCTION_ORDER_STATUS_LABELS[estatus]}
    </span>
  );
};

/** Badge de prioridad */
const PrioridadBadge = ({ prioridad }: { prioridad: ProductionOrderPriority }) => {
  const cfg = PRIORIDAD_CFG[prioridad];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${cfg.cls}`}>
      {PRODUCTION_ORDER_PRIORITY_LABELS[prioridad]}
    </span>
  );
};

/**
 * Indicador compacto de progreso sobre los 6 pasos canónicos.
 * Estados especiales: cancelada (gris), material_faltante (rojo), comprando (naranja), cerrada (verde).
 */
const MiniStepper = ({
  pasoActual,
  estatus,
}: {
  pasoActual: number;
  estatus: ProductionOrderStatus;
}) => {
  const total     = PRODUCTION_ORDER_STEPS.length; // 6
  const filled    = Math.min(pasoActual, total);
  const cancelado = estatus === 'cancelada';
  const faltante  = estatus === 'material_faltante';
  const comprando = estatus === 'comprando_materiales';
  const cerrada   = estatus === 'cerrada';

  const labelCls = cancelado
    ? 'text-zinc-400 dark:text-zinc-500'
    : faltante
    ? 'text-red-600 dark:text-red-400'
    : comprando
    ? 'text-orange-600 dark:text-orange-400'
    : cerrada
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-slate-700 dark:text-slate-200';

  const label = cancelado
    ? 'Cancelada'
    : faltante
    ? 'Bloqueada'
    : comprando
    ? 'Comprando'
    : cerrada
    ? 'Completa'
    : `Paso ${filled} / ${total}`;

  return (
    <div className="flex flex-col gap-1 min-w-24">
      <span className={`text-xs font-semibold tabular-nums ${labelCls}`}>{label}</span>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {PRODUCTION_ORDER_STEPS.map((_, i) => {
          const isDone    = i < filled;
          const isCurrent = i === filled - 1;

          let dotCls: string;
          if (cancelado) {
            dotCls = isDone ? 'w-3 bg-zinc-300 dark:bg-zinc-600' : 'w-3 bg-slate-100 dark:bg-white/10';
          } else if (faltante) {
            if (isCurrent) dotCls = 'w-4 bg-red-500 dark:bg-red-400';
            else if (isDone) dotCls = 'w-3 bg-red-200 dark:bg-red-800';
            else dotCls = 'w-3 bg-slate-200 dark:bg-white/10';
          } else if (comprando) {
            if (isCurrent) dotCls = 'w-4 bg-orange-500 dark:bg-orange-400';
            else if (isDone) dotCls = 'w-3 bg-orange-200 dark:bg-orange-800';
            else dotCls = 'w-3 bg-slate-200 dark:bg-white/10';
          } else if (cerrada) {
            dotCls = 'w-3 bg-emerald-400 dark:bg-emerald-500';
          } else if (isCurrent) {
            dotCls = 'w-4 bg-sky-500 dark:bg-sky-400';
          } else if (isDone) {
            dotCls = 'w-3 bg-sky-300 dark:bg-sky-600';
          } else {
            dotCls = 'w-3 bg-slate-200 dark:bg-white/10';
          }

          return <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${dotCls}`} />;
        })}
      </div>
    </div>
  );
};

// ── Celda de acciones ─────────────────────────────────────────────────────────

/** Gestiona el estado del diálogo de timeline y las acciones disponibles según el estatus */
const ActionsCell = ({ row }: { row: ProductionOrder }) => {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const { estatus, id } = row;

  const enProgreso = estatus !== 'cancelada' && estatus !== 'cerrada';

  const menuItems: ActionMenuItem[] = [
    // ── Acciones universales ─────────────────────────────────────────────────
    {
      label: 'Ver detalle',
      icon: ViewIcon,
      onSelect: () => console.log('ver-detalle', id),
    },
    {
      label: 'Ver historial',
      icon: HistoryIcon,
      onSelect: () => setIsTimelineOpen(true),
    },
    {
      label: 'Descargar OP',
      icon: DownloadIcon,
      onSelect: () => console.log('descargar-op', id),
    },

    // ── creada: iniciar verificación de materiales ───────────────────────────
    {
      label: 'Iniciar verificación',
      icon: PackageCheckIcon,
      onSelect: () => console.log('iniciar-verificacion', id),
      visible: estatus === 'creada',
    },

    // ── verificando_materiales: confirmar OK o reportar faltante ─────────────
    {
      label: 'Confirmar materiales OK',
      icon: CheckCircleIcon,
      onSelect: () => console.log('confirmar-materiales-ok', id),
      visible: estatus === 'verificando_materiales',
    },
    {
      label: 'Reportar faltante',
      icon: ExclamationTriangleIcon,
      onSelect: () => console.log('reportar-faltante', id),
      visible: estatus === 'verificando_materiales',
    },

    // ── material_faltante: iniciar proceso de compra ──────────────────────────
    {
      label: 'Iniciar compra de materiales',
      icon: ComprasIcon,
      onSelect: () => console.log('iniciar-compra', id),
      visible: estatus === 'material_faltante',
    },

    // ── comprando_materiales: confirmar llegada y abastecer ───────────────────
    {
      label: 'Confirmar materiales recibidos',
      icon: PackageCheckIcon,
      onSelect: () => console.log('confirmar-materiales-recibidos', id),
      visible: estatus === 'comprando_materiales',
    },

    // ── verificando_materiales | comprando → iniciar fabricación ─────────────
    {
      label: 'Iniciar fabricación',
      icon: FactoryIcon,
      onSelect: () => console.log('iniciar-fabricacion', id),
      visible: estatus === 'verificando_materiales' || estatus === 'comprando_materiales',
    },

    // ── en_fabricacion: registrar avance ─────────────────────────────────────
    {
      label: 'Registrar avance',
      icon: ClipboardListIcon,
      onSelect: () => console.log('registrar-avance', id),
      visible: estatus === 'en_fabricacion',
    },

    // ── registrando_avance: solicitar cierre ──────────────────────────────────
    {
      label: 'Solicitar cierre de OP',
      icon: CheckCircleIcon,
      onSelect: () => console.log('solicitar-cierre', id),
      visible: estatus === 'registrando_avance',
    },

    // ── cierre_solicitado: aprobar o rechazar cierre ──────────────────────────
    {
      label: 'Aprobar cierre',
      icon: CheckCircleIcon,
      onSelect: () => console.log('aprobar-cierre', id),
      visible: estatus === 'cierre_solicitado',
    },
    {
      label: 'Rechazar cierre',
      icon: RejectIcon,
      onSelect: () => console.log('rechazar-cierre', id),
      visible: estatus === 'cierre_solicitado',
    },

    // ── Cancelar OP (cuando está en progreso) ────────────────────────────────
    {
      label: 'Cancelar OP',
      icon: DeleteIcon,
      onSelect: () => console.log('cancelar-op', id),
      visible: enProgreso,
    },
  ];

  return (
    <>
      <ActionMenu
        items={menuItems}
        ariaLabel={`Acciones de la orden ${row.folio}`}
      />
      <ProductionOrderTimelineDialog
        order={row}
        open={isTimelineOpen}
        onOpenChange={setIsTimelineOpen}
      />
    </>
  );
};

// ── Definición de columnas ────────────────────────────────────────────────────

const columnHelper = createColumnHelper<ProductionOrder>();

export function getProductionOrderColumns(): ColumnDef<ProductionOrder, unknown>[] {
  return [
    // Folio
    columnHelper.accessor('folio', {
      header: 'Folio',
      size: 130,
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
          {getValue()}
        </span>
      ),
    }),

    // Producto
    columnHelper.display({
      id: 'producto',
      header: 'Producto',
      size: 220,
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-tight line-clamp-1">
            {row.original.nombre_producto}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {row.original.clave_producto}
          </span>
        </div>
      ),
    }),

    // Área
    columnHelper.accessor('area', {
      header: 'Área',
      size: 140,
      cell: ({ getValue }) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {getValue()}
        </span>
      ),
    }),

    // Cantidad
    columnHelper.display({
      id: 'cantidad',
      header: 'Cantidad',
      size: 110,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
          {row.original.cantidad_total.toLocaleString('es-MX')}{' '}
          <span className="text-xs text-slate-400">{row.original.unidad_medida}</span>
        </span>
      ),
    }),

    // Prioridad
    columnHelper.accessor('prioridad', {
      header: 'Prioridad',
      size: 90,
      cell: ({ getValue }) => <PrioridadBadge prioridad={getValue()} />,
    }),

    // Estatus
    columnHelper.accessor('estatus', {
      header: 'Estatus',
      size: 175,
      cell: ({ getValue }) => <EstatusBadge estatus={getValue()} />,
    }),

    // Progreso
    columnHelper.display({
      id: 'progreso',
      header: 'Progreso',
      size: 140,
      cell: ({ row }) => (
        <MiniStepper pasoActual={row.original.paso_actual} estatus={row.original.estatus} />
      ),
    }),

    // Responsable actual
    columnHelper.accessor('responsable_actual', {
      header: 'Responsable',
      size: 150,
      cell: ({ getValue }) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">{getValue()}</span>
      ),
    }),

    // Fecha estimada
    columnHelper.accessor('fecha_estimada_entrega', {
      header: 'Entrega estimada',
      size: 140,
      cell: ({ getValue }) => {
        const val = getValue();
        if (!val) {
          return <span className="text-xs text-slate-400 dark:text-slate-600 italic">—</span>;
        }
        const fecha = new Date(val);
        const hoy   = new Date();
        const vencida = fecha < hoy;
        return (
          <span
            className={`text-xs tabular-nums whitespace-nowrap ${
              vencida
                ? 'text-red-600 dark:text-red-400 font-medium'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        );
      },
    }),

    // Acciones
    columnHelper.display({
      id: 'acciones',
      header: '',
      size: 90,
      cell: ({ row }) => <ActionsCell row={row.original} />,
    }),
  ] as ColumnDef<ProductionOrder, unknown>[];
}
