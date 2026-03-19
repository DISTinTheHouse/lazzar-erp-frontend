"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import KpiGrid from "@/src/components/KpiGrid";
import { Loader } from "@/src/components/Loader";
import { CustomerViews } from "./CustomerViews";
import { useCustomer } from "../hooks/useCustomer";
import { buildCustomerKpis } from "../utils/customer-detail";

interface CustomerDetailContentProps {
  customerId: string;
}

export const CustomerDetailContent = ({ customerId }: CustomerDetailContentProps) => {
  const router = useRouter();
  const { data: selectedCustomer, isLoading, isError } = useCustomer(customerId);
  const items = useMemo(() => buildCustomerKpis(), []);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isError || !selectedCustomer) {
      router.replace("/sales/customers");
    }
  }, [isError, isLoading, router, selectedCustomer]);

  if (isLoading) {
    return <Loader title="Cargando cliente" message="Obteniendo detalle del cliente..." />;
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCustomer?.nombre}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {selectedCustomer?.razon_social} · {selectedCustomer?.correo}
        </p>
      </div>
      <KpiGrid items={items} />
      <CustomerViews />
    </div>
  );
};
