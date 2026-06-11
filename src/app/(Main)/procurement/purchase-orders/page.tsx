import { PurchaseOrderView } from "@/src/features/purchase-orders/components/PurchaseOrderView";

export default function PurchaseOrdersPage() {
  return (
    <div className="w-full space-y-8">
      <div>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gestión y seguimiento de órdenes de compra.
        </p>
      </div>

      <PurchaseOrderView />
    </div>
  );
}
