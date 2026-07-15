import { useMemo } from "react";
import { useCategoriesQuery } from "./useCategoriesQuery";
import { useTransactionsQuery } from "./useTransactionsQuery";
import { useChurchContributionsQuery } from "./useChurchContributionsQuery";
import { useSettingsQuery } from "./useSettingsQuery";
import { computeCategoriesWithStats, computeDashboardSummary } from "@/utils/calculations";

export function useDashboardSummary() {
  const { data: categoriesData, updatedAt: categoriesUpdatedAt } = useCategoriesQuery();
  const { data: transactionsData, updatedAt: transactionsUpdatedAt } = useTransactionsQuery();
  const { data: churchData, updatedAt: churchUpdatedAt } = useChurchContributionsQuery();
  const { soldeBancaire, updatedAt: settingsUpdatedAt } = useSettingsQuery();

  const categories = useMemo(
    () => computeCategoriesWithStats(categoriesData, transactionsData, churchData, soldeBancaire),
    [categoriesData, transactionsData, churchData, soldeBancaire],
  );

  const summary = useMemo(
    () => computeDashboardSummary(categories, transactionsData.length, churchData, soldeBancaire),
    [categories, churchData, transactionsData, soldeBancaire],
  );

  return {
    ...summary,
    categories,
    isLoading: !categoriesUpdatedAt || !transactionsUpdatedAt || !churchUpdatedAt || !settingsUpdatedAt,
  };
}
