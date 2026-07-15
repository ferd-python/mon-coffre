import { useMemo } from "react";
import { useCategoriesQuery } from "./useCategoriesQuery";
import { useTransactionsQuery } from "./useTransactionsQuery";
import { useChurchContributionsQuery } from "./useChurchContributionsQuery";
import { computeCategoriesWithStats, computeDashboardSummary } from "@/utils/calculations";

export function useDashboardSummary() {
  const { data: categoriesData, updatedAt: categoriesUpdatedAt } = useCategoriesQuery();
  const { data: transactionsData, updatedAt: transactionsUpdatedAt } = useTransactionsQuery();
  const { data: churchData, updatedAt: churchUpdatedAt } = useChurchContributionsQuery();

  const categories = useMemo(
    () => computeCategoriesWithStats(categoriesData, transactionsData, churchData),
    [categoriesData, transactionsData, churchData],
  );

  const summary = useMemo(
    () => computeDashboardSummary(categories, transactionsData.length, churchData),
    [categories, churchData, transactionsData],
  );

  return {
    ...summary,
    categories,
    isLoading: !categoriesUpdatedAt || !transactionsUpdatedAt || !churchUpdatedAt,
  };
}
