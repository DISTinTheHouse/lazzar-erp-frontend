import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../services/actions";
import { ProductFormValues } from "../schemas/product.schema";
import type { ProductCreate } from "../interfaces/product.interface";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type SetProductError = (
  field: keyof ProductFormValues,
  error: { type?: string; message?: string }
) => void;

export const useCreateProduct = (setError?: SetProductError) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductCreate) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto registrado correctamente");
    },
    onError: (error) => {
      if (error instanceof AxiosError && setError) {
        const statusCode = error.response?.status;
        const data = error.response?.data;

        if (statusCode === 400 && data) {
          const validationErrors = data as Record<string, string[]>;

          Object.keys(validationErrors).forEach((key) => {
            const fieldKey = key as keyof ProductFormValues;
            const errorMessages = validationErrors[key];

            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              setError(fieldKey, {
                type: "server",
                message: errorMessages[0],
              });
            }
          });
        }
      }
      toast.error("Error al registrar el producto");
    },
  });
};
