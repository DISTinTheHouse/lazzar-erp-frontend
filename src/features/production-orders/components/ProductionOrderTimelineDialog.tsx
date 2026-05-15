"use client";

import { CheckIcon, HistoryIcon, ClipboardListIcon, ComprasIcon } from "@/src/components/Icons";
import { MainDialog } from "@/src/components/MainDialog";
import type {
  ProductionOrder,
  ProductionOrderStatus,
  ProductionOrderEventRecord,
} from "../interfaces/production-order.interface";
import {
  PRODUCTION_ORDER_STEPS,
  PRODUCTION_ORDER_STATUS_LABELS,
} from "../interfaces/production-order.interface";

// ── Configuración visual por estatus ─────────────────────────────────────────

const ESTATUS_CFG: Record<ProductionOrderStatus, { badgeCls: string; dotCls: string }> = {
  creada:                  { badgeCls: 'bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300',         dotCls: 'bg-slate-400' },
  verificando_materiales:  { badgeCls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',         dotCls: 'bg-amber-500' },
  en_fabricacion:          { badgeCls: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',                 dotCls: 'bg-sky-500' },
  registrando_avance:      { badgeCls: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',     dotCls: 'bg-violet-500' },
  cierre_solicitado:       { badgeCls: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',             dotCls: 'bg-teal-500' },
  cerrada:                 { badgeCls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', dotCls: 'bg-emerald-500' },
  comprando_materiales:    { badgeCls: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',     dotCls: 'bg-orange-500' },
  material_faltante:       { badgeCls: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',                dotCls: 'bg-red-500' },
  cancelada:               { badgeCls: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-500/10 dark:text-zinc-400',            dotCls: 'bg-zinc-400' },
};

// ── Tipos internos del timeline ───────────────────────────────────────────────

interface TimelineStep {
  /** Número de paso (1-6 para canónicos; 2.5 para comprando_materiales) */
  paso: number;
  /** Etiqueta del paso en el timeline */
  label: string;
  /** Estatus que representa este punto del flujo */
  estatus: ProductionOrderStatus;
  /** El paso ya fue completado */
  completado: boolean;
  /** Es el paso activo actual */
  esCurrent: boolean;
  /** Indica si este paso fue omitido (sin faltantes → comprando saltado) */
  omitido: boolean;
  /** Datos del evento real si existe en el historial */
  evento?: ProductionOrderEventRecord;
}

/**
 * Construye la lista de pasos del timeline.
 * Para órdenes con faltantes se inserta el paso de comprando_materiales
 * entre el paso 2 y el paso 3.
 */
function buildTimelineSteps(order: ProductionOrder): TimelineStep[] {
  const { historial, paso_actual, estatus, tuvo_faltantes } = order;
  const esCancelado = estatus === 'cancelada';
  const esFaltante  = estatus === 'material_faltante';
  const esComprando = estatus === 'comprando_materiales';
  const esCerrada   = estatus === 'cerrada';

  // Construir los 6 pasos canónicos
  const pasos: TimelineStep[] = PRODUCTION_ORDER_STEPS.map((stepKey, idx) => {
    const numeroPaso  = idx + 1;
    const eventoReal  = historial.find((e) => e.paso === numeroPaso);

    const completado = numeroPaso < paso_actual || esCerrada;
    const esCurrent  = numeroPaso === paso_actual && !esComprando;

    const estatusPaso: ProductionOrderStatus =
      eventoReal?.estatus ??
      (esCurrent && (esCancelado || esFaltante) ? estatus : stepKey);

    return {
      paso:      numeroPaso,
      label:     PRODUCTION_ORDER_STATUS_LABELS[stepKey],
      estatus:   estatusPaso,
      completado,
      esCurrent,
      omitido:   false,
      evento:    eventoReal,
    };
  });

  // Insertar el paso de comprando_materiales entre el paso 2 y el 3
  const eventoComprando = historial.find((e) => e.paso === 2.5);

  // Paso de faltantes: visible siempre que la orden pasó o está pasando por esa ruta
  const mostrarFaltantes = tuvo_faltantes || esFaltante || esComprando;

  const pasoFaltantes: TimelineStep = {
    paso:      2.5,
    label:     PRODUCTION_ORDER_STATUS_LABELS['comprando_materiales'],
    estatus:   'comprando_materiales',
    completado: eventoComprando !== undefined && !esComprando,
    esCurrent:  esComprando,
    omitido:   !mostrarFaltantes,
    evento:    eventoComprando,
  };

  // Insertar entre el paso 2 (índice 1) y el paso 3 (índice 2)
  const resultado = [
    ...pasos.slice(0, 2),
    pasoFaltantes,
    ...pasos.slice(2),
  ];

  return resultado;
}

// ── Sub-componentes del timeline ──────────────────────────────────────────────

interface TimelineItemProps {
  step: TimelineStep;
  isLast: boolean;
}

function TimelineItem({ step, isLast }: TimelineItemProps) {
  const esCancelado = step.estatus === 'cancelada';
  const esFaltante  = step.estatus === 'material_faltante';
  const esComprando = step.estatus === 'comprando_materiales' && step.esCurrent;
  const cfg = ESTATUS_CFG[step.estatus];

  // Paso omitido: mostrar en gris simplificado
  if (step.omitido) {
    return (
      <div className="flex gap-3 relative">
        {!isLast && (
          <div className="absolute left-3.5 top-7 w-px h-full bg-slate-100 dark:bg-white/5" />
        )}
        <div className="shrink-0 w-7 h-7 flex items-center justify-center z-10 mt-0.5">
          <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700" />
        </div>
        <div className="flex-1 pb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 dark:text-slate-700">
            Compra de materiales — No aplica
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 relative">
      {/* Línea vertical conectora */}
      {!isLast && (
        <div className="absolute left-3.5 top-7 w-px h-full bg-slate-200 dark:bg-white/10" />
      )}

      {/* Indicador de estado */}
      <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10 mt-0.5">
        {esCancelado && step.esCurrent ? (
          <div className="w-6 h-6 rounded-full bg-zinc-400 flex items-center justify-center shadow-sm">
            <span className="text-white text-[10px] font-bold leading-none">✕</span>
          </div>
        ) : esFaltante && step.esCurrent ? (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_0_4px_rgba(239,68,68,0.2)]">
            <span className="text-white text-[10px] font-bold leading-none">!</span>
          </div>
        ) : esComprando ? (
          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_0_4px_rgba(249,115,22,0.2)]">
            <ComprasIcon className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
        ) : step.completado ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
            <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        ) : step.esCurrent ? (
          <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center shadow-[0_0_0_4px_rgba(14,165,233,0.2)]">
            <ClipboardListIcon className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-zinc-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
        )}
      </div>

      {/* Contenido del paso */}
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex-1 min-w-0">
            {/* Número de paso + badge de estatus */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {step.paso === 2.5 ? 'Ruta faltantes' : `Paso ${step.paso}`}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badgeCls}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dotCls}`} aria-hidden="true" />
                {step.label}
              </span>
            </div>

            {/* Notas del evento si están disponibles */}
            {step.evento?.notas && (step.completado || step.esCurrent) && (
              <p
                className={`text-sm leading-snug ${
                  (esCancelado || esFaltante) && step.esCurrent
                    ? 'text-red-600 dark:text-red-400 font-medium'
                    : step.completado
                    ? 'text-slate-600 dark:text-slate-300'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {step.evento.notas}
              </p>
            )}

            {/* Texto apagado para pasos futuros */}
            {!step.completado && !step.esCurrent && (
              <p className="text-xs text-slate-400 dark:text-slate-600 italic">Pendiente</p>
            )}
          </div>

          {/* Fecha y responsable — solo para pasos ejecutados */}
          {step.evento && (step.completado || step.esCurrent) && (
            <div className="text-right shrink-0">
              <p className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                {new Date(step.evento.fecha).toLocaleDateString('es-MX', {
                  day:   '2-digit',
                  month: 'short',
                  year:  'numeric',
                })}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {step.evento.responsable}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal del diálogo ─────────────────────────────────────────

interface ProductionOrderTimelineDialogProps {
  order: ProductionOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductionOrderTimelineDialog({
  order,
  open,
  onOpenChange,
}: ProductionOrderTimelineDialogProps) {
  const steps         = buildTimelineSteps(order);
  const esCancelado   = order.estatus === 'cancelada';
  const esCerrada     = order.estatus === 'cerrada';
  const esFaltante    = order.estatus === 'material_faltante';
  const esComprando   = order.estatus === 'comprando_materiales';

  const titleCls = esCancelado
    ? 'text-zinc-500 dark:text-zinc-400'
    : esFaltante
    ? 'text-red-600 dark:text-red-400'
    : esComprando
    ? 'text-orange-600 dark:text-orange-400'
    : esCerrada
    ? 'text-emerald-600 dark:text-emerald-500'
    : 'text-slate-800 dark:text-slate-100';

  return (
    <MainDialog
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="520px"
      showCloseButton={true}
      title={
        <div className="flex items-center gap-2.5 pr-8">
          <HistoryIcon className="w-5 h-5 text-sky-500 shrink-0" />
          <div>
            <p className={`text-base font-semibold leading-tight ${titleCls}`}>
              Historial de flujo
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-normal mt-0.5">
              {order.folio} · {order.nombre_producto}
            </p>
          </div>
        </div>
      }
    >
      {/* Resumen de la orden */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3 mb-4 rounded-xl bg-slate-50 dark:bg-white/5 text-xs">
        <div>
          <span className="text-slate-400 dark:text-slate-500">Área</span>
          <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">{order.area}</p>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500">Cantidad</span>
          <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">
            {order.cantidad_total.toLocaleString('es-MX')} {order.unidad_medida}
          </p>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500">Responsable actual</span>
          <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">{order.responsable_actual}</p>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500">Entrega estimada</span>
          <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">
            {order.fecha_estimada_entrega
              ? new Date(order.fecha_estimada_entrega).toLocaleDateString('es-MX', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })
              : '—'}
          </p>
        </div>
        {order.observaciones.trim().length > 0 && (
          <div className="col-span-2">
            <span className="text-slate-400 dark:text-slate-500">Observaciones</span>
            <p className="font-medium text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
              {order.observaciones}
            </p>
          </div>
        )}
      </div>

      {/* Timeline de pasos */}
      <div className="px-1 py-1">
        {steps.map((step, index) => (
          <TimelineItem
            key={String(step.paso)}
            step={step}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </MainDialog>
  );
}
