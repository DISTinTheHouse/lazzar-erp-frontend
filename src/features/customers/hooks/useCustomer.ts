import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Customer } from "../interfaces/customer.interface";
import { getCustomer } from "../services/actions";

export const useCustomer = (customerId: string) => {
  const queryClient = useQueryClient();
  const numericCustomerId = Number(customerId);

  return useQuery<Customer>({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomer(numericCustomerId),
    enabled: Number.isFinite(numericCustomerId) && numericCustomerId > 0,
    initialData: () => {
      const fromDetailCache = queryClient.getQueryData<Customer>(["customer", customerId]);
      if (fromDetailCache) {
        return fromDetailCache;
      }
      const customers = queryClient.getQueryData<Customer[]>(["customers"]);
      return customers?.find((item) => item.id === customerId);
    },
  });
};
