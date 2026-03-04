import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/actions";
import { Product } from "../interfaces/product.interface";

export const useProducts = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return {
    products,
    isLoading,
    isError,
    error,
  };
};
