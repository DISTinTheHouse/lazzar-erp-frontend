"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { Button } from "@/src/components/Button";
import { ErrorState } from "@/src/components/ErrorState";
import {
  FactoryIcon,
  PackageCheckIcon,
  PackageXIcon,
  WarehouseIcon,
} from "@/src/components/Icons";
import { LoadingSkeleton } from "@/src/components/LoadingSkeleton";
import { MainDialog } from "@/src/components/MainDialog";
import { useOperationsQuoteStockDetails } from "../hooks/useOperationsQuoteStockDetails";
import type {
  NormalizedOperationsQuoteStockDetail,
  OperationsQuoteStockReviewDialogProps,
} from "../types/quote-stock-review.types";
import {
  availabilityStyles,
  getGroupAvailability,
  getSizeAvailability,
} from "../utils/quote-stock-availability.utils";

export function OperationsQuoteStockReviewDialog({
  open,
  onOpenChange,
  operationsQuote,
}: OperationsQuoteStockReviewDialogProps) {
  // Consulta el detalle de stock solo cuando el diálogo está abierto (enabled: open),
  // evitando peticiones innecesarias mientras el modal permanece cerrado.
  const {
    operationsQuoteStockDetails,
    isLoading,
    isError,
    error,
  } = useOperationsQuoteStockDetails(operationsQuote.id, { enabled: open });

  // Estado de selección para solicitar producción: clave de partida → marcada (boolean).
  // Inicia vacío; el componente se remonta automáticamente al abrir el diálogo (key en el padre),
  // lo que garantiza que las selecciones se limpian sin necesitar un efecto secundario.
  const [productionSelections, setProductionSelections] = useState<
    Record<string, boolean>
  >({});

  // Enriquece cada partida con una clave estable para React y para el mapa de selecciones.
  // La clave combina producto + color + índice para evitar colisiones entre variantes.
  const normalizedStockDetails = useMemo<NormalizedOperationsQuoteStockDetail[]>(
    () =>
      operationsQuoteStockDetails.map((stockDetail, index) => ({
        ...stockDetail,
        key: `${stockDetail.producto}-${stockDetail.color}-${index}`,
      })),
    [operationsQuoteStockDetails]
  );

  // Calcula el porcentaje global de disponibilidad:
  // suma mínimo(stock_actual, cantidad_pedida) por talla para no superar el 100 % por partida.
  const stockPercent = useMemo(() => {
    const totalRequested = normalizedStockDetails.reduce(
      (sum, stockDetail) =>
        sum +
        stockDetail.tallas.reduce(
          (detailSum, stockSize) => detailSum + stockSize.cantidad_pedida,
          0
        ),
      0
    );
    const totalCovered = normalizedStockDetails.reduce(
      (sum, stockDetail) =>
        sum +
        stockDetail.tallas.reduce(
          (detailSum, stockSize) =>
            detailSum + Math.min(stockSize.stock_actual, stockSize.cantidad_pedida),
          0
        ),
      0
    );

    return totalRequested > 0
      ? Math.round((totalCovered / totalRequested) * 100)
      : 100;
  }, [normalizedStockDetails]);

  // Partidas con al menos una talla sin stock suficiente.
  // Determina la visibilidad del botón de solicitar producción en el footer.
  const missingStockItems = useMemo(
    () =>
      normalizedStockDetails.filter(
        (stockDetail) => getGroupAvailability(stockDetail) !== "full"
      ),
    [normalizedStockDetails]
  );

  // Partidas marcadas explícitamente por el operador para incluirlas en producción.
  // Se usa para el contador del botón y para construir el resumen de solicitud.
  const selectedProductionItems = useMemo(
    () =>
      normalizedStockDetails.filter(
        (stockDetail) => productionSelections[stockDetail.key]
      ),
    [normalizedStockDetails, productionSelections]
  );

  const hasMissingStock = missingStockItems.length > 0;

  // Fecha de creación formateada en español para el subtítulo del diálogo.
  const formattedDate = useMemo(
    () =>
      format(new Date(operationsQuote.created_at), "d 'de' MMMM yyyy", {
        locale: es,
      }),
    [operationsQuote.created_at]
  );

  // Etiqueta dinámica del botón principal según las selecciones activas de producción.
  const requestButtonLabel =
    selectedProductionItems.length > 0
      ? `Solicitar producción (${selectedProductionItems.length})`
      : "Selecciona faltantes";

  // Alterna la selección de producción de una partida identificada por su clave.
  const handleToggleProduction = (stockDetailKey: string) => {
    setProductionSelections((prev) => ({
      ...prev,
      [stockDetailKey]: !prev[stockDetailKey],
    }));
  };

  // Confirma la solicitud de producción: valida que haya partidas marcadas y notifica al operador.
  const handleRequestProduction = () => {
    if (selectedProductionItems.length === 0) {
      toast.error("Selecciona al menos una partida sin stock para producción");
      return;
    }

    toast.success(
      selectedProductionItems.length === 1
        ? "Se marcó 1 partida para producción"
        : `Se marcaron ${selectedProductionItems.length} partidas para producción`
    );
    onOpenChange(false);
  };

  return (
    <MainDialog
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="960px"
      showCloseButton={false}
      actionButtonClose={false}
      title={
        <span className="flex items-center gap-2">
          <WarehouseIcon className="w-4 h-4 text-sky-500" aria-hidden="true" />
          Revisión de inventario — #{String(operationsQuote.id).padStart(5, "0")}
        </span>
      }
      description={`${
        operationsQuote.cliente_razon_social || operationsQuote.cliente_nombre
      } · ${formattedDate}`}
      actionButton={
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {/* Botón de producción: solo visible cuando existen partidas con stock insuficiente */}
          {hasMissingStock && !isLoading && !isError && (
            <Button
              variant="primary"
              leftIcon={<FactoryIcon className="w-4 h-4" aria-hidden="true" />}
              disabled={selectedProductionItems.length === 0}
              onClick={handleRequestProduction}
            >
              {requestButtonLabel}
            </Button>
          )}
        </div>
      }
    >
      {/* Barra de progreso global: skeleton mientras carga, barra real una vez resueltos los datos */}
      <div className="mb-4">
        {isLoading ? (
          <>
            <div className="flex justify-between items-center mb-1.5">
              <LoadingSkeleton className="h-3 w-48 rounded-full" />
              <LoadingSkeleton className="h-3 w-8 rounded-full" />
            </div>
            <LoadingSkeleton className="h-2 rounded-full" />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Disponibilidad global de la cotización</span>
              <span className="font-semibold tabular-nums">{stockPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stockPercent >= 100
                    ? "bg-emerald-500"
                    : stockPercent >= 50
                      ? "bg-amber-400"
                      : "bg-rose-500"
                }`}
                style={{ width: `${stockPercent}%` }}
                role="progressbar"
                aria-valuenow={stockPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Disponibilidad de stock: ${stockPercent}%`}
              />
            </div>
          </>
        )}
      </div>

      {/* Renderizado condicional: skeleton de carga → error → sin datos → lista de partidas */}
      {isLoading ? (
        <div className="space-y-4" role="status" aria-label="Cargando detalle de stock">
          <LoadingSkeleton className="h-20 rounded-2xl" />
          <LoadingSkeleton className="h-56 rounded-2xl" />
          <LoadingSkeleton className="h-56 rounded-2xl" />
        </div>
      ) : isError ? (
        <ErrorState
          title="No se pudo cargar el detalle de stock"
          message={(error as Error).message}
        />
      ) : normalizedStockDetails.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-6 text-center">
          <WarehouseIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            No hay detalle de inventario disponible
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Esta cotización no devolvió partidas de stock para revisión.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {normalizedStockDetails.map((stockDetail) => {
            const availability = getGroupAvailability(stockDetail);
            const styles = availabilityStyles[availability];
            // Unidades faltantes totales de la partida para el indicador visual del encabezado.
            const missingUnits = stockDetail.tallas.reduce(
              (sum, stockSize) =>
                sum + Math.max(stockSize.cantidad_pedida - stockSize.stock_actual, 0),
              0
            );
            const requiresProduction = availability !== "full";
            const ItemIcon = availability === "full" ? PackageCheckIcon : PackageXIcon;

            return (
              <section
                key={stockDetail.key}
                className={`rounded-2xl border overflow-hidden ${styles.card}`}
                aria-label={`Detalle de stock de ${stockDetail.producto}`}
              >
                <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-white/70 dark:bg-black/10 p-2">
                        <ItemIcon className={`w-5 h-5 ${styles.iconClass}`} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                          {stockDetail.producto}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Color: {stockDetail.color}
                        </p>
                        {missingUnits > 0 && (
                          <div className="mt-2">
                            <span className="rounded-full bg-white/80 dark:bg-black/10 px-2.5 py-1 text-[11px] font-medium text-rose-600 dark:text-rose-300">
                              Faltante: {missingUnits}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${styles.badge}`}
                    >
                      {styles.label}
                    </span>
                    {/* Checkbox de producción: solo visible en partidas con stock insuficiente.
                        El badge "Disponible" ya comunica el estado positivo. */}
                    {requiresProduction && (
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productionSelections[stockDetail.key] ?? false}
                          onChange={() => handleToggleProduction(stockDetail.key)}
                          className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                        />
                        Solicitar producción
                      </label>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-black/10 overflow-x-auto">
                  <table
                    className="w-full min-w-150 text-sm"
                    aria-label={`Tallas de ${stockDetail.producto}`}
                  >
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-200/70 dark:border-white/10">
                        <th className="text-left py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Talla
                        </th>
                        <th className="text-center py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Solicitado
                        </th>
                        <th className="text-center py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Stock actual
                        </th>
                        <th className="text-center py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Diferencia
                        </th>
                        <th className="text-center py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {stockDetail.tallas.map((stockSize) => {
                        const sizeAvailability = getSizeAvailability(stockSize);
                        const sizeStyles = availabilityStyles[sizeAvailability];

                        return (
                          <tr
                            key={`${stockDetail.key}-${stockSize.talla}`}
                            className={sizeStyles.row}
                          >
                            <td className="py-3 px-3 font-medium text-slate-800 dark:text-white">
                              {stockSize.talla}
                            </td>
                            <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-200 font-mono font-semibold">
                              {stockSize.cantidad_pedida}
                            </td>
                            <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-200 font-mono font-semibold">
                              {stockSize.stock_actual}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`font-mono font-bold ${
                                  stockSize.diferencia >= 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {stockSize.diferencia >= 0
                                  ? `+${stockSize.diferencia}`
                                  : stockSize.diferencia}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${sizeStyles.badge}`}
                              >
                                {sizeStyles.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}

          {selectedProductionItems.length > 0 && (
            <div className="rounded-2xl border border-sky-200/70 dark:border-sky-500/20 bg-sky-50/80 dark:bg-sky-900/10 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white/80 dark:bg-black/10 p-2">
                  <FactoryIcon className="w-5 h-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-sky-800 dark:text-sky-200">
                    Solicitud de producción preparada
                  </p>
                  {/* <p className="text-xs text-sky-700/90 dark:text-sky-200/80 mt-1">
                    Se marcarán {selectedProductionItems.length} partida{selectedProductionItems.length !== 1 ? "s" : ""} con faltante para seguimiento operativo.
                  </p> */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProductionItems.map((stockDetail) => (
                      <span
                        key={stockDetail.key}
                        className="inline-flex items-center rounded-full bg-white/90 dark:bg-black/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-200"
                      >
                        {stockDetail.producto} · {stockDetail.color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hasMissingStock && (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-3 py-2.5 border border-emerald-200/60 dark:border-emerald-700/30 leading-relaxed">
              Todas las partidas tienen stock suficiente. No es necesario solicitar producción para esta cotización.
            </p>
          )}

          {hasMissingStock && selectedProductionItems.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Marca las partidas con stock insuficiente para solicitar producción.
            </p>
          )}
        </div>
      )}
    </MainDialog>
  );
}