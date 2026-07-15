import { useMemo } from "react";
import { useCategoriesQuery } from "./useCategoriesQuery";
import { useTransactionsQuery } from "./useTransactionsQuery";
import { computeTransactionsWithCategory, type TransactionWithCategory } from "@/utils/calculations";

export type { TransactionWithCategory };

export function useTransactionsWithCategory() {
  const { data: transactionsData, error, updatedAt } = useTransactionsQuery();
  const { data: categoriesData } = useCategoriesQuery();

  const transactions = useMemo(
    () => computeTransactionsWithCategory(transactionsData, categoriesData),
    [transactionsData, categoriesData],
  );

  return { transactions, isLoading: !updatedAt, error };
}
