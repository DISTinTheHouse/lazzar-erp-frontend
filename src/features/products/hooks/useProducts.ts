import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/actions";
import { Product } from "../interfaces/product.interface";

export const useProducts = (tipo_id?: number | string) => {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products", tipo_id],
    queryFn: () => getProducts(tipo_id),
  });

  return {
    products,
    isLoading,
    isError,
    error,
  };
};
