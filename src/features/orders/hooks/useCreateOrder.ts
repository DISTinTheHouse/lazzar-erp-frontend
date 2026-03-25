"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { createOrder } from "../services/actions";
import type { OrderCreate } from "../interfaces/order.interface";

type SetOrderError = (
  field: keyof OrderCreate,
  error: { type?: string; message?: string }
) => void;

export const useCreateOrder = (setError?: SetOrderError) => {
  const queryClient = useQueryClient();

  return useMutation<OrderCreate, unknown, OrderCreate>({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido registrado correctamente");
    },
    onError: (error) => {
      if (error instanceof AxiosError && setError) {
        const statusCode = error.response?.status;
        const data = error.response?.data;

        if (statusCode === 400 && data) {
          const validationErrors = data as Record<string, string[]>;
          Object.keys(validationErrors).forEach((key) => {
            const fieldKey = key as keyof OrderCreate;
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
      toast.error("No se pudo registrar el pedido");
    },
  });
};
