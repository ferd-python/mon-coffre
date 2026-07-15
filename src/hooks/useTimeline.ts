import { useMemo } from "react";
import { useTransactionsWithCategory } from "./useTransactionsWithCategory";
import { useChurchContributionsQuery } from "./useChurchContributionsQuery";
import { computeTimeline } from "@/utils/calculations";

export function useTimeline() {
  const { transactions, isLoading: isLoadingTransactions } = useTransactionsWithCategory();
  const { data: churchData, updatedAt: churchUpdatedAt } = useChurchContributionsQuery();

  const items = useMemo(() => computeTimeline(transactions, churchData), [transactions, churchData]);

  return { items, isLoading: isLoadingTransactions || !churchUpdatedAt };
}
