import { v1_api } from "@/src/api/v1.api";
import { Product, ProductCreate } from "../interfaces/product.interface";


export const getProducts = async (): Promise<Product[]> => {
  const response = await v1_api.get<Product[]>("/catalogo/producto/");
  return response.data;
};

export const createProduct = async (product: ProductCreate): Promise<Product> => {
  const response = await v1_api.post<Product>("/catalogo/producto/", product);
  return response.data;
};

export const updateProduct = async (id: number, product: ProductCreate): Promise<Product> => {
  const response = await v1_api.put<Product>(`/catalogo/producto/${id}/`, product);
  return response.data;
}

export const deleteProduct = async (id: number): Promise<void> => {
  await v1_api.delete(`/catalogo/producto/${id}/`);
}