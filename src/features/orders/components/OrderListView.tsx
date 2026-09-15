'use client';

import { useRouter } from 'next/navigation';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/src/components/DataTable';
import { extractErrorMessage } from '@/src/utils/extractErrorMessage';
import { ordersQueryKey, useOrders } from '../hooks/useOrders';
import type { OrdersQueryParams } from '../services/actions';
import {
  createOrderColumns,
  enrichOrdersWithStatus,
  sharedOrderFilterConfig,
} from './SharedOrderColumns';
import { createSalesOrderColumns } from './SalesOrderColumns';
import type { PedidoListItem } from '../interfaces/order.interface';

interface OrderListViewProps {
  /**
   * Origen de la navegación. Viaja como `?from=` al detalle 360° para que el
   * "Volver" regrese a la lista del módulo correcto (`wms`, `procurement`,
   * `sales`, …).
   */
  from: string;
  /**
   * Filtros de `GET /ventas/pedidos/`. Sin params se listan todos; con
   * `{ mis_pedidos: "true" }` el backend acota a los pedidos del vendedor.
   * Cada variante cachea e invalida su propia queryKey por separado.
   */
  params?: OrdersQueryParams;
  /**
   * `"sales"` activa el layout compacto de "Mis pedidos": columnas de
   * `SalesOrderColumns.tsx` (folio con punto de confirmación, sin
   * Estado/Fecha confirmada/Acciones), 20 filas por página y densidad
   * compacta. Por defecto (`"shared"`) conserva exactamente la tabla de
   * `SharedOrderColumns.tsx` que siguen usando Almacén y Compras.
   */
  variant?: 'shared' | 'sales';
}

/**
 * Lista de pedidos compartida por los módulos que consumen `GET
 * /ventas/pedidos/` en modo solo lectura (Almacén, Compras/SCM, Ventas). Misma
 * tabla que la Mesa de Control, pero sin confirmar la fecha del pedido: eso
 * vive únicamente en Mesa de Control.
 */
export function OrderListView({ from, params, variant = 'shared' }: OrderListViewProps) {
  const { orders, isLoading, isError, error } = useOrders(params);
  const queryClient = useQueryClient();
  const router = useRouter();
  // Acotamos a la queryKey de esta variante para no encender el spinner ni
  // invalidar el caché de otras vistas de pedidos (p. ej. "Mis pedidos").
  const queryKey = ordersQueryKey(params);
  const isRefetching = useIsFetching({ queryKey, exact: true }) > 0;

  // Detalle 360° del pedido en su ruta neutra; `?from` hace que el "Volver"
  // regrese a esta lista.
  const handleViewDetail = (order: PedidoListItem) =>
    router.push(`/orders/${order.id}?from=${from}`);

  const handleRefetch = () =>
    queryClient.invalidateQueries({ queryKey, exact: true });

  const isSales = variant === 'sales';
  const columns = isSales
    ? createSalesOrderColumns({ onViewDetail: handleViewDetail })
    : createOrderColumns({ onViewDetail: handleViewDetail });
  const enrichedOrders = enrichOrdersWithStatus(orders);

  // Leyenda del punto de confirmación, integrada en la barra de herramientas
  // (vía `actionButton`) en vez de una fila propia: no depende de hover (que
  // en touch no existe) y no empuja la tabla hacia abajo.
  const confirmationLegend = isSales ? (
    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
        Por confirmar
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" aria-hidden="true" />
        Confirmado
      </span>
    </div>
  ) : undefined;

  return (
    <DataTable
      columns={columns}
      data={enrichedOrders}
      baseDataCount={orders.length}
      searchPlaceholder={
        isSales ? 'Filtrar resultados: folio, cliente, fecha' : 'Buscar por folio, cliente u OC...'
      }
      searchAlwaysExpanded={isSales}
      // En Ventas el filtro de estado vive en el propio encabezado de Folio
      // (`FolioHeaderFilter`, en `SalesOrderColumns.tsx`) — sin
      // `filterConfig` no se renderiza el panel de chips genérico. Almacén y
      // Compras conservan ese panel sin cambios.
      filterConfig={isSales ? undefined : sharedOrderFilterConfig}
      actionButton={confirmationLegend}
      framed={isSales}
      isLoading={isLoading}
      isError={isError}
      errorTitle="Error al cargar pedidos"
      errorMessage={extractErrorMessage(error, 'No se pudo cargar la información.')}
      onErrorRetry={handleRefetch}
      loadingAriaLabel="Cargando pedidos"
      onRefetch={handleRefetch}
      isRefetching={isRefetching}
      isLoadingOverlay={isRefetching}
      defaultPageSize={isSales ? 20 : undefined}
      density={isSales ? 'compact' : undefined}
    />
  );
}
