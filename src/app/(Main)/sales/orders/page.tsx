import { Metadata } from 'next';
import { OrderListView } from '@/src/features/orders/components/OrderListView';

export const metadata: Metadata = {
  title: 'Mis Pedidos | CRM y Ventas | ERP',
  description:
    'Pedidos originados en las cotizaciones que creaste, con acceso a su detalle.',
};

export default function SalesOrdersPage() {
  return (
    <main className="w-full" aria-label="Mis pedidos">
      <section aria-label="Lista de pedidos">
        <OrderListView from="sales" params={{ mis_pedidos: 'true' }} variant="sales" />
      </section>
    </main>
  );
}
