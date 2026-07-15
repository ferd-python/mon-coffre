import { useMemo } from "react";
import { useCategoriesQuery } from "./useCategoriesQuery";
import { useTransactionsQuery } from "./useTransactionsQuery";
import { useChurchContributionsQuery } from "./useChurchContributionsQuery";
import { useSettingsQuery } from "./useSettingsQuery";
import { computeCategoriesWithStats, type CategoryWithStats } from "@/utils/calculations";

export type { CategoryWithStats };

export function useCategoriesWithStats() {
  const { data: categoriesData, error, updatedAt } = useCategoriesQuery();
  const { data: transactionsData } = useTransactionsQuery();
  const { data: churchData } = useChurchContributionsQuery();
  const { soldeBancaire } = useSettingsQuery();

  const categories = useMemo(
    () => computeCategoriesWithStats(categoriesData, transactionsData, churchData, soldeBancaire),
    [categoriesData, transactionsData, churchData, soldeBancaire],
  );

  return { categories, isLoading: !updatedAt, error };
}
