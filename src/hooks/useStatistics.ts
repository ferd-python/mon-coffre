import { useMemo } from "react";
import { useCategoriesQuery } from "./useCategoriesQuery";
import { useTransactionsQuery } from "./useTransactionsQuery";
import { useChurchContributionsQuery } from "./useChurchContributionsQuery";
import {
  computeCategoriesWithStats,
  computeTransactionsWithCategory,
  computeStatistics,
} from "@/utils/calculations";

export function useStatistics() {
  const { data: categoriesData, updatedAt: categoriesUpdatedAt } = useCategoriesQuery();
  const { data: transactionsData, updatedAt: transactionsUpdatedAt } = useTransactionsQuery();
  const { data: churchData, updatedAt: churchUpdatedAt } = useChurchContributionsQuery();

  const categories = useMemo(
    () => computeCategoriesWithStats(categoriesData, transactionsData, churchData),
    [categoriesData, transactionsData, churchData],
  );

  const transactions = useMemo(
    () => computeTransactionsWithCategory(transactionsData, categoriesData),
    [transactionsData, categoriesData],
  );

  const stats = useMemo(
    () => computeStatistics(transactions, categories),
    [transactions, categories],
  );

  return {
    ...stats,
    isLoading: !categoriesUpdatedAt || !transactionsUpdatedAt || !churchUpdatedAt,
  };
}
