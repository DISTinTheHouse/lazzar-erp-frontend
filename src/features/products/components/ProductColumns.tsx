import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { EditIcon, DeleteIcon } from "../../../components/Icons";
import { Product } from "../interfaces/product.interface";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { useDeleteProduct } from "../hooks/useDeleteProduct";

const columnHelper = createColumnHelper<Product>();

interface ProductLookups {
  categories: Map<number, string>;
  units: Map<number, string>;
  taxes: Map<number, string>;
  satProdserv: Map<number, string>;
  satUnit: Map<number, string>;
  productTypes: Map<string, string>;
}

const ActionsCell = ({
  row,
  onEdit,
  canEdit,
  canDelete,
}: {
  row: Row<Product>;
  onEdit: (product: Product) => void;
  canEdit: boolean;
  canDelete: boolean;
}) => {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  return (
    <div className="flex items-center justify-center gap-2">
      {canEdit ? (
        <button
          className="p-1 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
          title="Editar"
          onClick={() => onEdit(row.original)}
        >
          <EditIcon className="w-5 h-5" />
        </button>
      ) : null}
      {canDelete ? (
        <ConfirmDialog
          title="Eliminar Producto"
          description="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
          confirmText={isPending ? "Eliminando..." : "Eliminar"}
          onConfirm={() => deleteProduct(row.original.id)}
          confirmColor="red"
          trigger={
            <button
              className="p-1 cursor-pointer text-slate-400 hover:text-red-600 transition-colors"
              title="Eliminar"
              disabled={isPending}
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          }
        />
      ) : null}
    </div>
  );
};

export const getColumns = (
  onEdit: (product: Product) => void,
  permissions: { canEdit: boolean; canDelete: boolean },
  lookups: ProductLookups
) => {
  const columns = [
    columnHelper.accessor((row) => (row.activo ? "Activo" : "Inactivo"), {
      id: "activo",
      header: "Estado",
      cell: ({ row }) => {
        const isActive = row.original.activo;
        const styles = isActive
          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
          : "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400";
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
            {isActive ? "Activo" : "Inactivo"}
          </span>
        );
      },
    }),
    columnHelper.accessor("nombre", {
      header: "Nombre",
      cell: (info) => (
        <span className="text-slate-600 dark:text-slate-300 font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor(
      (row) => lookups.productTypes.get(row.tipo) ?? "",
      {
        id: "tipo",
        header: "Tipo",
        cell: ({ row }) => (
          <span className="text-slate-500 dark:text-slate-400">
            {lookups.productTypes.get(row.original.tipo) ?? row.original.tipo}
          </span>
        ),
      }
    ),
    columnHelper.accessor(
      (row) => lookups.categories.get(row.categoria_producto) ?? "",
      {
        id: "categoria_producto",
        header: "Categoría",
        cell: ({ row }) => (
          <span className="text-slate-500 dark:text-slate-400">
            {lookups.categories.get(row.original.categoria_producto) ??
              `#${row.original.categoria_producto}`}
          </span>
        ),
      }
    ),
    columnHelper.accessor(
      (row) => lookups.units.get(row.unidad_medida) ?? "",
      {
        id: "unidad_medida",
        header: "Unidad",
        cell: ({ row }) => (
          <span className="text-slate-500 dark:text-slate-400">
            {lookups.units.get(row.original.unidad_medida) ?? `#${row.original.unidad_medida}`}
          </span>
        ),
      }
    ),
    columnHelper.accessor(
      (row) => lookups.taxes.get(row.impuesto) ?? "",
      {
        id: "impuesto",
        header: "Impuesto",
        cell: ({ row }) => (
          <span className="text-slate-500 dark:text-slate-400">
            {lookups.taxes.get(row.original.impuesto) ?? `#${row.original.impuesto}`}
          </span>
        ),
      }
    ),
    columnHelper.accessor(
      (row) => lookups.satProdserv.get(row.sat_prodserv) ?? "",
      {
        id: "sat_prodserv",
        header: "SAT Prod/Serv",
        cell: ({ row }) => (
          <span className="text-slate-500 dark:text-slate-400">
            {lookups.satProdserv.get(row.original.sat_prodserv) ?? `#${row.original.sat_prodserv}`}
          </span>
        ),
      }
    ),
    columnHelper.accessor(
      (row) => lookups.satUnit.get(row.sat_unidad) ?? "",
      {
        id: "sat_unidad",
        header: "SAT Unidad",
        cell: ({ row }) => (
          <span className="text-slate-500 dark:text-slate-400">
            {lookups.satUnit.get(row.original.sat_unidad) ?? `#${row.original.sat_unidad}`}
          </span>
        ),
      }
    ),
  ] as ColumnDef<Product>[];

  if (permissions.canEdit || permissions.canDelete) {
    columns.push(
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-center">Acciones</div>,
        cell: ({ row }) => (
          <ActionsCell
            row={row}
            onEdit={onEdit}
            canEdit={permissions.canEdit}
            canDelete={permissions.canDelete}
          />
        ),
      }) as ColumnDef<Product>
    );
  }

  return columns;
};
