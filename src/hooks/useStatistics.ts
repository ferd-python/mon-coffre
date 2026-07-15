import { useMemo } from "react";
import { useCategoriesQuery } from "./useCategoriesQuery";
import { useTransactionsQuery } from "./useTransactionsQuery";
import { useChurchContributionsQuery } from "./useChurchContributionsQuery";
import { useSettingsQuery } from "./useSettingsQuery";
import {
  computeCategoriesWithStats,
  computeTransactionsWithCategory,
  computeStatistics,
} from "@/utils/calculations";

export function useStatistics() {
  const { data: categoriesData, updatedAt: categoriesUpdatedAt } = useCategoriesQuery();
  const { data: transactionsData, updatedAt: transactionsUpdatedAt } = useTransactionsQuery();
  const { data: churchData, updatedAt: churchUpdatedAt } = useChurchContributionsQuery();
  const { soldeBancaire } = useSettingsQuery();

  const categories = useMemo(
    () => computeCategoriesWithStats(categoriesData, transactionsData, churchData, soldeBancaire),
    [categoriesData, transactionsData, churchData, soldeBancaire],
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
    soldeBancaire,
    isLoading: !categoriesUpdatedAt || !transactionsUpdatedAt || !churchUpdatedAt,
  };
}
