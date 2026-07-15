import { useEffect, useRef } from "react";
import { useCategoriesQuery } from "./useCategoriesQuery";
import { useTransactionsQuery } from "./useTransactionsQuery";
import { useChurchContributionsQuery } from "./useChurchContributionsQuery";
import { useSettingsQuery } from "./useSettingsQuery";
import { useToast } from "@/lib/toast";

const SYNC_ERROR_MESSAGE =
  "Impossible de synchroniser vos données. Vos données restent enregistrées sur l'appareil.";

export function useSyncErrorWatcher() {
  const { showToast } = useToast();
  const { error: categoriesError } = useCategoriesQuery();
  const { error: transactionsError } = useTransactionsQuery();
  const { error: churchError } = useChurchContributionsQuery();
  const { error: settingsError } = useSettingsQuery();
  const lastReportedError = useRef<Error | null>(null);

  const error = categoriesError ?? transactionsError ?? churchError ?? settingsError ?? null;

  useEffect(() => {
    if (error && lastReportedError.current !== error) {
      lastReportedError.current = error;
      showToast("error", SYNC_ERROR_MESSAGE);
    }
  }, [error, showToast]);
}
