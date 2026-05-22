export interface TableMiniStepperVariant<Status extends string> {
  statuses: readonly Status[];
  accentDotClass: string;
}

export interface TableMiniStepperProps<Status extends string> {
  steps: readonly unknown[];
  step: number;
  status: Status;
  cancelledStatuses?: readonly Status[];
  completedStatuses?: readonly Status[];
  blockedVariants?: readonly TableMiniStepperVariant<Status>[];
  className?: string;
}

const BASE_DOT_CLASS = 'w-2.5 h-2.5 rounded-sm';
const PENDING_DOT_CLASS = `bg-slate-200 dark:bg-slate-700 ${BASE_DOT_CLASS}`;
const DONE_DOT_CLASS = `bg-sky-400 ${BASE_DOT_CLASS}`;
const CURRENT_DOT_CLASS = `bg-sky-500 ${BASE_DOT_CLASS} ring-2 ring-sky-200 dark:ring-sky-800`;
const COMPLETED_DOT_CLASS = `bg-emerald-500 ${BASE_DOT_CLASS}`;
const CANCELLED_DONE_DOT_CLASS = `bg-zinc-400 ${BASE_DOT_CLASS}`;
const CANCELLED_PENDING_DOT_CLASS = `bg-zinc-200 dark:bg-zinc-700 ${BASE_DOT_CLASS}`;

/**
 * Stepper compacto para tablas con la misma lógica visual y condicional
 * usada en revisiones de pedidos: la etiqueta solo se muestra en pasos activos.
 */
export function TableMiniStepper<Status extends string>({
  steps,
  step,
  status,
  cancelledStatuses = [],
  completedStatuses = [],
  blockedVariants = [],
  className = 'min-w-28',
}: TableMiniStepperProps<Status>) {
  const total = steps.length;
  const filled = Math.max(0, Math.min(step, total));
  const isCancelled = cancelledStatuses.includes(status);
  const isCompleted = completedStatuses.includes(status);
  const blockedVariant = blockedVariants.find((variant) => variant.statuses.includes(status));
  const shouldShowLabel = !isCancelled && !isCompleted && blockedVariant === undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`.trim()}>
      {shouldShowLabel && (
        <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
          {`Paso ${filled} / ${total}`}
        </span>
      )}
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {steps.map((_, index) => {
          const isDone = index < filled;
          const isCurrent = index === filled - 1 && !isCompleted;

          let dotClass = PENDING_DOT_CLASS;

          if (isCancelled) {
            dotClass = isDone ? CANCELLED_DONE_DOT_CLASS : CANCELLED_PENDING_DOT_CLASS;
          } else if (blockedVariant) {
            dotClass = isDone
              ? `${index < filled - 1 ? 'bg-blue-400' : blockedVariant.accentDotClass} ${BASE_DOT_CLASS}`
              : PENDING_DOT_CLASS;
          } else if (isCompleted) {
            dotClass = COMPLETED_DOT_CLASS;
          } else if (isCurrent) {
            dotClass = CURRENT_DOT_CLASS;
          } else if (isDone) {
            dotClass = DONE_DOT_CLASS;
          }

          return <span key={index} className={`${dotClass} transition-all`} />;
        })}
      </div>
    </div>
  );
}