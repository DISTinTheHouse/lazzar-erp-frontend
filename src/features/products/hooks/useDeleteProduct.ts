import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../services/actions";
import toast from "react-hot-toast";
import { Product } from "../interfaces/product.interface";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData<Product[]>(["products"]);

      if (previousProducts) {
        queryClient.setQueryData<Product[]>(["products"], (old) =>
          old ? old.filter((product) => product.id !== id) : []
        );
      }

      return { previousProducts };
    },
    onError: (err, id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      console.error(err);
      toast.error("Error al eliminar el producto");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      toast.success("Producto eliminado correctamente");
    },
  });
};
