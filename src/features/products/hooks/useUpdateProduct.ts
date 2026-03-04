import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../services/actions";
import { ProductFormValues } from "../schemas/product.schema";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { UseFormSetError } from "react-hook-form";

interface UpdateProductPayload extends ProductFormValues {
  id: number;
  empresa: number;
}

export const useUpdateProduct = (setError?: UseFormSetError<ProductFormValues>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...values }: UpdateProductPayload) => updateProduct(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto actualizado correctamente");
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
      toast.error("Error al actualizar el producto");
    },
  });
};
