"use client";

import { useQuery } from "@tanstack/react-query";
import { OperationsQuoteStockDetail } from "../interfaces/operations-quote-stock-detail.interface";
import { getOperationsQuoteStockDetails } from "../services/actions";

export const operationsQuoteStockDetailsQueryKey = [
	"operations-quote-stock-details",
] as const;

interface UseOperationsQuoteStockDetailsOptions {
	enabled?: boolean;
}

export const useOperationsQuoteStockDetails = (
	operationsQuoteId: number | null,
	options: UseOperationsQuoteStockDetailsOptions = {}
) => {
	const { enabled = true } = options;

	const {
		data: operationsQuoteStockDetails = [],
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
	} = useQuery<OperationsQuoteStockDetail[]>({
		queryKey: [...operationsQuoteStockDetailsQueryKey, operationsQuoteId],
		queryFn: () => getOperationsQuoteStockDetails(operationsQuoteId as number),
		enabled: Boolean(operationsQuoteId) && enabled,
	});

	return {
		operationsQuoteStockDetails,
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
	};
};
